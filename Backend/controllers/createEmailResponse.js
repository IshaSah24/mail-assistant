import { generateAiResponse } from "../utils/togetherApi.js";

const createEmailResponse = async (req, res) => {
  try {
    // runs  only  if  the button  in  triggered by the user
    const { emailContent, tone } = req.body;
    console.log("Content:", emailContent);
    console.log("Tone:", tone);

    if (!emailContent) {
      return res.status(400).json({ error: "Email content is empty" });
    }

    const aiResponse = await generateAiResponse(emailContent, tone);
    console.log("Raw AI response:", aiResponse);
    res.json({ response: aiResponse });
  } catch (err) {
    console.error("Error generating AI response:", err);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({
          error: "An error occurred while generating the email response",
        });
    }
  }
};

export default createEmailResponse;
