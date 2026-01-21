import mongoose from "mongoose";

const HoroscopeSchema = new mongoose.Schema(
  {
    zodiac: {
      type: String,
      required: true, // aries, taurus...
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    content_hi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Horoscope ||
  mongoose.model("Horoscope", HoroscopeSchema);

  