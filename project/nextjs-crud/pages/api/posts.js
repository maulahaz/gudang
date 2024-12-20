// pages/api/posts.js
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const response = await axios.get(API_URL);
        res.status(200).json(response.data);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
      }
      break;
    case 'POST':
      try {
        const { title, body } = req.body;
        const response = await axios.post(API_URL, { title, body });
        res.status(201).json(response.data);
      } catch (error) {
        res.status(500).json({ error: 'Error creating post' });
      }
      break;
    case 'PUT':
      try {
        const { id, title, body } = req.body;
        const response = await axios.put(`${API_URL}/${id}`, { title, body });
        res.status(200).json(response.data);
      } catch (error) {
        res.status(500).json({ error: 'Error updating post' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.body;
        await axios.delete(`${API_URL}/${id}`);
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
      }
      break;
    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}
