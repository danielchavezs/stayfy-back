const { createBooks } = require("./src/controllers/books/getBooksController");
const { createDefaultAdminUser } = require("./src/db");

async function initDB(){
    try {
        await createBooks()
        await createDefaultAdminUser();
        return
    } catch (error) {
        console.log(error);
        throw new Error (error)
    };
}

initDB();