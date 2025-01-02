const startShift = async (req, res) => {
  try {
    const { branch, shiftId } = req.body;
    const userId = req.params.id;

    // הוספת השעה הנוכחית אוטומטית
    const startTime = new Date();

    // עדכון המשמרת עם השעה הנוכחית
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          shifts: {
            branch,
            shiftId,
            startTime, // השעה מתווספת אוטומטית
            status: "active",
          },
        },
      },
      { new: true }
    );

    // ... המשך הלוגיקה
  } catch (error) {
    // ... טיפול בשגיאות
  }
};
