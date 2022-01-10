const { db, models: {User}} = require('./database')

async function createUser() {
  await User.create({
    username: 'Peter',
    password: '123'
  })
}

async function runSeed() {
  console.log("seeding...");
  try {
    await db.sync({force: true})
    await createUser()
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

runSeed()
