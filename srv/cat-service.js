const cds = require("@sap/cds");

// Add logging configuration
const LOG = cds.log("catalog-service");

module.exports = async (srv) => {
  // Get the Books entity from your namespace
  const { Books } = cds.entities("sap.capire.bookshop");

  // Implement the submitOrder action
  srv.on("submitOrder", async (req) => {
    // Get the book ID and quantity from the request
    const { book: bookId, quantity } = req.data;

    // Input validation
    if (!quantity || quantity <= 0) {
      return req.error(400, "Please order at least 1 book");
    }

    try {
      // Start a transaction
      const tx = cds.transaction(req);

      // Check if book exists and get current stock
      const book = await tx.read(Books).where({ ID: bookId });

      // If book array is empty, the book doesn't exist
      if (!book || book.length === 0) {
        return req.error(404, `Book with ID ${bookId} not found`);
      }

      // If we get here, we know the book exists
      // Now check if we have enough stock
      if (book[0].stock < quantity) {
        return req.error(
          409,
          `Not enough stock. Available: ${book[0].stock}, Requested: ${quantity}`
        );
      }

      // Try to update the stock
      const affectedRows = await tx.run(
        UPDATE(Books)
          .set({ stock: { "-=": quantity } })
          .where({
            ID: bookId,
            stock: { ">=": quantity },
          })
      );

      if (affectedRows === 0) {
        return req.error(
          409,
          "Sorry, this book is out of stock or insufficient quantity available"
        );
      }

      // Return success response using req.reply()
      return req.reply({
        message: `Successfully ordered ${quantity} book(s)`,
        details: {
          bookId,
          quantity,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error:", error);
      return req.error(500, "Error processing order");
    }
  });

  // Add discount information after reading books
  srv.after("READ", "Books", (each) => {
    // Add discount message for books with high stock
    if (each.stock > 100) {
      LOG.info("Applying discount to book:", {
        bookId: each.ID,
        stock: each.stock,
      });
      each.title += " -- 20% discount!";
    }
  });
};
