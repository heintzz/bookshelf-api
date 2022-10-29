const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = readPage === pageCount
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query

  // no query
  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => {
          const { id, name, publisher } = book
          return {
            id,
            name,
            publisher
          }
        })
      }
    })
    response.code(200)
    return response
  }

  // reading query
  if (reading) {
    const filteredBooksThatInReading = books.filter(
      (book) => Number(book.reading) === Number(reading)
    )

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooksThatInReading.map((book) => {
          const { id, name, publisher } = book
          return {
            id,
            name,
            publisher
          }
        })
      }
    })
    response.code(200)
    return response
  }

  // finished query
  if (finished) {
    const filteredBooksThatHasFinished = books.filter(
      (book) => Number(book.finished) === Number(finished)
    )

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooksThatHasFinished.map((book) => {
          const { id, name, publisher } = book
          return {
            id,
            name,
            publisher
          }
        })
      }
    })
    response.code(200)
    return response
  }

  // name query
  if (name) {
    const filteredBooksByName = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    )

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooksByName.map((book) => {
          const { id, name, publisher } = book
          return {
            id,
            name,
            publisher
          }
        })
      }
    })
    response.code(200)
    return response
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    const response = h.response({
      status: 'success',
      data: {
        book: books[index]
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    const finished = readPage === pageCount
    const updatedAt = new Date().toISOString()

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        books
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooks,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
