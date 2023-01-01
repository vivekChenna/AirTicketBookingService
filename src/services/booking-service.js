const axios = require("axios");

const ServiceError = require("../utils/errors/service-error");
const { BookingRepository } = require("../repository/index");

const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightId = data.flightId;

      console.log(data);

      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(getFlightRequestURL);

      const flightData = response.data.data;

      console.log(response.data.data);

      const PriceOfTheFlight = flightData.price;

      const totalCost = data.noOfSeats * PriceOfTheFlight;

      console.log(totalCost);

      const bookingPayload = { ...data, totalCost };

      console.log(bookingPayload);

      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "something went wrong in the booking process",
          "Insufficient seats"
        );
      }

      const booking = await this.bookingRepository.create(bookingPayload);

      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

      console.log(updateFlightRequestURL);

      await axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats - bookingPayload.noOfSeats,
      });

      console.log();

      const finalBooking = await this.bookingRepository.updateBooking(
        booking.id,
        {
          status: "Booked",
        }
      );

      console.log(finalBooking);

      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
