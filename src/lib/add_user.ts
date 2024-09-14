import {connectDB} from "@/lib/drizzle/db"
import { UserRepo } from "@/lib/drizzle/schema"

async function addUser(){
  const db = await connectDB()
  await db.insert(UserRepo).values({
    name: "Kamaal2",
    color: "red",
    email: "kamaal@kamaal.me"
  });

  const users = await db.query.UserRepo.findMany();
  console.log(users)

}
addUser().catch(console.log)
