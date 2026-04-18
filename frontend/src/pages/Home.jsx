import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TaskContext from "../context/TaskContext.jsx";
import { useContext } from "react";
import api from "../api/axios.js";
import Task from "../components/HomeTaskInput.jsx";
import LikeButton from "../components/LikeButton"
const HomePage = () => {
  const { tasks, loading, deleteTaskFromState, currentUserId } = useContext(TaskContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await api.post("/auth/logout");

      toast.success(res.data.message);
      navigate("/auth/login");
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      toast.error(message);
      console.log(err);
    }
  };

  const deleteTask = async (uuid) => {
    try {
      const res = await api.delete(`/task/${uuid}`);

      toast.success(res.data.message);
      deleteTaskFromState(uuid);
    } catch (err) {
      const message = err?.response?.data?.error || err.message;
      toast.error(message);
      console.log(err);
    }
  };

  return (
    <div>
      <h1> Welcome to Pnuma</h1>
      <h2>Testimony feed </h2>

      <div>
        <button onClick={logout}> logout</button>
        <button onClick={() => navigate("/createtask")}>CreateTask</button>

        <hr />
      </div>
      {loading ? (
        <p> Loading...</p>
      ) : (
        <div>
          {tasks.map((task) => {
            return <Task key={task.id} 
            task={task}
            deleteTask={deleteTask} 
            isOwner={task.user_id === currentUserId}
             />;
          })}
        </div>
      )}
      
    </div>
  );
};

export default HomePage;
