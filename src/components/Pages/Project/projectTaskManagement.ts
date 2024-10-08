import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, storage } from "@/utils/firebase";

interface Task {
  name: string;
  description: string;
  date: string;
  priority: string;
}

export const projectTaskUploading = (
  projectName: string | undefined,
  taskName: string | undefined,
  taskDes: string | undefined,
  selectedDate: string,
  selectedPriority: string
): Promise<string | null> => {
  const user = auth.currentUser;
  const taskData = {
    name: taskName,
    description: taskDes,
    date: selectedDate,
    priority: selectedPriority,
  };
  if (user) {
    const uid = user.uid;
    const fileName = `${taskData.name}.json`;
    const fileBlob = new Blob([JSON.stringify(taskData)], {
      type: "application/json",
    });

    const file = new File([fileBlob], fileName, { type: "application/json" });

    const storageRef = ref(
      storage,
      `${uid}/MyProjects/${projectName}/${file.name}`
    );

    return uploadBytes(storageRef, file)
      .then(() => "Uploaded a JSON file!")
      .catch((error) => {
        console.log(error);
        return "Error uploading file:";
      });
  }
  return Promise.resolve(null);
};

export const fetchProjectTasks = async (
  projectName: string | undefined
): Promise<Task[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");

  const uid = user.uid;
  const tasksRef = ref(storage, `${uid}/MyProjects/${projectName}/`);
  const result = await listAll(tasksRef);

  const taskPromises = result.items.map(async (itemRef) => {
    const downloadURL = await getDownloadURL(itemRef);
    const response = await fetch(downloadURL);
    if (!response.ok)
      throw new Error(`Failed to fetch task: ${response.statusText}`);

    return await response.json();
  });

  return Promise.all(taskPromises);
};

export const deleteProjectTask = async (
  projectName: string,
  taskName: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");

  const uid = user.uid;
  const taskRef = ref(
    storage,
    `${uid}/MyProjects/${projectName}/${taskName}.json`
  );

  try {
    await deleteObject(taskRef);
    console.log(`Task ${taskName} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
