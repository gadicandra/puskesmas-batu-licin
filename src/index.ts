import { prisma } from '../lib/prisma'

async function main() {
    // Create a new user with a post (random email for testing)
    const randomId = Math.random().toString(36).substring(7);
    const user = await prisma.user.create({
        data: {
            name: 'Alice',
            email: `alice-${randomId}@prisma.io`,
            posts: {
                create: {
                    title: 'Hello World',
                    content: 'This is my first post!',
                    published: true,
                },
            },
        },
        include: {
            posts: true,
        },
    })
    console.log('Created user:', user)

    // Fetch all users with their posts
    const allUsers = await prisma.user.findMany({
        include: {
            posts: true,
        },
    })
    console.log('All users:', JSON.stringify(allUsers, null, 2))
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })