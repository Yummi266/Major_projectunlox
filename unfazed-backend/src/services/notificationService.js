const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  recipientRole,
  type,
  title,
  message,
  relatedId = null,
}) => {
  try {
    if (!recipient || !recipientRole || !title || !message) {
      return null;
    }

    const notification = await Notification.create({
      recipient,
      recipientRole,
      type: type || "system",
      title,
      message,
      relatedId,
    });

    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error.message);
    return null;
  }
};

module.exports = {
  createNotification,
};
