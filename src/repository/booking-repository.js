const { ValidationError, AppError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

const { Booking } = require("../models/index");

class BookingRepository {
  async create(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      console.log(error);

      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }

      throw new AppError(
        "RepositoryError",
        "cannot create booking",
        "there was some issue creating the booking ,please try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateBooking(bookingId, data) {
    try {
      const booking = await Booking.findByPk(bookingId);

      console.log(booking);

      if (data.status) {
        booking.status = data.status;
      }

      await booking.save();

      return booking;
    } catch (error) {
      console.log(error);
      console.log("something went wrong while updating in repository layer");
    }
  }
}

module.exports = BookingRepository;
