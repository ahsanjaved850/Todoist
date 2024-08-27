import React, { useEffect, useState } from "react";
import { Tasks, TasksDisplayWindow } from "./today.style";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { deleteTask, retrieveAllTasks } from "../AddTask/taskManaging";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { priorityColors } from "../../utils/constants";
import ShimmerUI from "../../utils/ShimmerUI";

interface Task {
  name: string;
  description: string;
  date: string;
  priority: string;
}

interface TodayProps {
  refreshTask: boolean;
  handleRefreshTasks: () => void;
}

const Today: React.FC<TodayProps> = ({ refreshTask, handleRefreshTasks }) => {
  const [todayTasks, setTodayTasks] = useState<Task[] | null>(null);

  const handleDelete = async (taskName: string) => {
    try {
      await deleteTask(taskName);
      // Update UI by removing the deleted task from state
      setTodayTasks((prevTasks) =>
        prevTasks ? prevTasks.filter((task) => task.name !== taskName) : null
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await retrieveAllTasks();
        const sortedTasks = tasks
          .filter((task) => task.date === "today")
          .sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
        setTodayTasks(sortedTasks);
      } catch (error) {
        console.error("Failed to retrieve tasks:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTasks();
        if (refreshTask) {
          handleRefreshTasks();
        }
      }
    });

    return () => unsubscribe();
  }, [refreshTask, handleRefreshTasks]);

  return (
    <div>
      <TasksDisplayWindow>
        <div>
          <h2>Today</h2>
          <h5>
            <span>
              <FiCheckCircle />
            </span>
            Total tasks: {todayTasks?.length || 0}
          </h5>
        </div>
        {todayTasks && todayTasks.length > 0 ? (
          todayTasks.map((task, index) => (
            <Tasks
              color={priorityColors[task.priority as "1" | "2" | "3" | "4"]}
              key={index}
            >
              <span onClick={() => handleDelete(task.name)}>
                <FiCircle className="fi-circle" />
                <FiCheckCircle className="fi-check-circle" />
              </span>
              <div>
                <h3>{task.name}</h3>
                <p>{task.description}</p>
              </div>
            </Tasks>
          ))
        ) : (
          <ShimmerUI />
        )}
      </TasksDisplayWindow>
    </div>
  );
};

export default Today;
