export default async function handler(req, res) {
  const { token, topic } = JSON.parse(req.body);
  console.log(`ini ${token} ${topic}`)
  try {
    const response = await fetch(
      `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`,
      {
        method: "POST",
        headers: {
          // Authorization: `key=AAAAYG7jEpY:APA91bGPQdcXoPNTNaEwfcU4Q-ZQPult2XbWZv8m9vzPqT57zhw4tVtFFfupy9f5GZ_GtQ2yD_FZyHtxuJCoNhFx-4vGy1P-hO-7_TwTZQOvnQwjWfmbKPMnxC5iATW2gdGfsjipQt5t`,
          Authorization: `key=AAAAgWeqGPM:APA91bFyK_AJEQXav8PW-vqzTV7S0kU35RXbc6rN28mlxoitK88q1Me3nhZfR8PihOBYb0XvMt3EXQYIZwYWpRo5RGg3phYyY4Aq-kOqDisghb1boQPd6saRQ2bsOOM-MxDyBaclUZa6`,
        },
      }
    );
    if (response.status < 200 || response.status >= 400) {
      return res.status(response.status).json({
        message: `Error subscribing to topic: Error ${response.status}`,
      });
    }
    return res
      .status(200)
      .json({ message: `Sucessfully subscribing to topic` });
  } catch (error) {
    return res
      .status(response.status)
      .json({ message: `Unexpected Error: Error ${response.status}` });
  }
}
