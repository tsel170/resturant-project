import { Modal, Box, Typography, TextField, Button } from "@mui/material"
import { useState } from "react"

const AddMeal = () => {
  const [showRecipeModal, setShowRecipeModal] = useState(false)
  const [recipeDuration, setRecipeDuration] = useState("")

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setShowRecipeModal(true)}
        sx={{ mt: 2 }}
      >
        Add Recipe
      </Button>

      <Modal open={showRecipeModal} onClose={() => setShowRecipeModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Add Recipe
          </Typography>
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={recipeDuration}
            onChange={(e) => setRecipeDuration(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setShowRecipeModal(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                // Handle recipe submission here
                setShowRecipeModal(false)
              }}
            >
              Save Recipe
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default AddMeal
