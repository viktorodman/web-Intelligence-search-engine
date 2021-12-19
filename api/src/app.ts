import Server from "./server"


const main = async() => {
    const server = new Server(5000)

    server.run()
}

main().catch(console.error)