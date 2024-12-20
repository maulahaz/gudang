// pages/index.js
import { useEffect, useState } from 'react';
import ModalForm from '../components/ModalForm';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = (data) => {
    axios
      .post('/api/posts', data)
      .then(() => {
        fetchPosts();
        setModalOpen(false);
      })
      .catch((error) => console.error('Error creating post:', error));
  };

  const handleUpdatePost = (data) => {
    axios
      .put('/api/posts', { ...data, id: editingPost.id })
      .then(() => {
        fetchPosts();
        setModalOpen(false);
        setEditingPost(null);
      })
      .catch((error) => console.error('Error updating post:', error));
  };

  const handleDeletePost = (id) => {
    axios
      .delete('/api/posts', { data: { id } })
      .then(() => fetchPosts())
      .catch((error) => console.error('Error deleting post:', error));
  };

  const openModal = (post = null) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  if (!isLoggedIn) {
    return <div>Please log in to manage posts.</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <button onClick={() => openModal()}>Create Post</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => openModal(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <ModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        initialData={editingPost}
      />
    </div>
  );
}
