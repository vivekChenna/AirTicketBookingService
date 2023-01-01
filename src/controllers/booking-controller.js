const { BookingService } = require("../services/index");

const { StatusCodes } = require("http-status-codes");

const bookingService = new BookingService();

const create = async (req, res) => {
  try {
    const response = await bookingService.createBooking(req.body);

    // console.log(req.body);

    return res.status(StatusCodes.CREATED).json({
      data: response,
      success: true,
      err: {},
      message: "successfully created a booking ",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      data: {},
      success: false,
      err: error.explanation,
      message: error.message,
    });
  }
};

module.exports = {
  create,
};
