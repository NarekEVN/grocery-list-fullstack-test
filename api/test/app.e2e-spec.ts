import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'
import { MockAuthGuard } from './utils/mock-auth.guard'
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard'
import { GroceryItemStatus } from '@prisma/client'
import { groceryItemFixtures } from './fixtures/grocery-item.fixture'

describe('GroceryController (e2e)', () => {
  const url = '/api/v1/grocery'
  let app: INestApplication
  let prisma: PrismaService
  let server: any
  let fixtureIds: string[] = []

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.enableVersioning({
      type: VersioningType.URI,
    })
    app.setGlobalPrefix('api')

    await app.init()
    server = app.getHttpServer()

    prisma = app.get(PrismaService)
    await prisma.$connect()

    await prisma.user.upsert({
      where: { id: '7f21c221-363c-41b0-9b11-319d9c12dc34' },
      update: {},
      create: {
        id: '7f21c221-363c-41b0-9b11-319d9c12dc36',
        email: 'test@example.com',
        password: 'testpassword',
      },
    })
  })

  afterAll(async () => {
    if (fixtureIds.length > 0) {
      await prisma.groceryItemStatusHistory.deleteMany({
        where: { groceryItemId: { in: fixtureIds } },
      })
      await prisma.groceryItem.deleteMany({
        where: { id: { in: fixtureIds } },
      })
    }
    await prisma.user.deleteMany({
      where: { id: 'test-user-id-12345' },
    })
    await app.close()
  })

  beforeEach(async () => {
    if (fixtureIds.length > 0) {
      await prisma.groceryItemStatusHistory.deleteMany({
        where: { groceryItemId: { in: fixtureIds } },
      })
      await prisma.groceryItem.deleteMany({
        where: { id: { in: fixtureIds } },
      })
    }

    const inserted = await Promise.all(groceryItemFixtures.map(item => prisma.groceryItem.create({ data: item })))
    fixtureIds = inserted.map(item => item.id)
  })
  afterEach(async () => {
    if (fixtureIds.length > 0) {
      await prisma.groceryItemStatusHistory.deleteMany({
        where: { groceryItemId: { in: fixtureIds } },
      })
      await prisma.groceryItem.deleteMany({
        where: { id: { in: fixtureIds } },
      })
    }
    fixtureIds = []
  })

  it('Should filter groceries', async () => {
    const res = await request(server).get(url)

    expect(res.body.data.length).toBe(groceryItemFixtures.length)
    expect(res.body.data[0]).toMatchObject({ name: groceryItemFixtures[0].name })
  })

  it('Should create grocery item', async () => {
    const dto = { name: 'Eggs', priority: 3, status: GroceryItemStatus.HAVE }
    const res = await request(server).post(url).send(dto).expect(201)
    expect(res.body.data).toMatchObject(dto)

    const inDb = await prisma.groceryItem.findUnique({ where: { id: res.body.data.id } })
    expect(inDb).not.toBeNull()
  })

  it('Should return grocery item', async () => {
    const id = fixtureIds[0]
    const res = await request(server).get(`${url}/${id}`).expect(200)
    expect(res.body.data).toMatchObject({ id, name: groceryItemFixtures[0].name })
  })

  it('Should update grocery item', async () => {
    const id = fixtureIds[0]
    const dto = { name: 'Updated Milk', status: GroceryItemStatus.RANOUT }
    const res = await request(server).put(`${url}/${id}`).send(dto).expect(200)
    expect(res.body.data).toMatchObject(dto)

    const history = await prisma.groceryItemStatusHistory.findMany({ where: { groceryItemId: id } })
    expect(history.length).toBe(1)
  })

  it('Should delete grocery item', async () => {
    const id = fixtureIds[0]
    await request(server).delete(`${url}/${id}`).expect(200)

    const inDb = await prisma.groceryItem.findUnique({ where: { id } })
    expect(inDb).toBeNull()
  })
})
