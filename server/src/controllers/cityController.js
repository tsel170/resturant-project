import City from "../models/cityModel.js";

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cities", error: error.message });
  }
};

export const createCity = async (req, res) => {
  const { name } = req.body;
  try {
    const newCity = await City.create({ name });
    res.status(201).json(newCity);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create city", error: error.message });
  }
};
