import React, { useState, useEffect } from 'react'
import { Tasks } from './Tasks'
import TaskProgress from './TaskProgress'
import { CompletedTasks } from './CompletedTasks'
import firebase from '../../../../backend/firebaseConfig'
import { CircularProgress } from "@rmwc/circular-progress"
import '@rmwc/circular-progress/circular-progress.css'
import moment from 'moment'


const MyTasks = () => {
  const initialTasksState = []
  const uid = localStorage.getItem("uid")
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState(initialTasksState)
  const [completedTasks, setCompletedTasks] = useState([])

  const deleteTask = (id) => {
    const newTasks = [...tasks]
    newTasks.splice(id, 1)
    firebase.db.collection("tasks").doc(uid).set({
      tasks: newTasks
    })
  }
  const markComplete = (index) => {
    deleteTask(index)
    const taskObj = {
      id: tasks[index].id,
      title: tasks[index].title,
      description: tasks[index].description,
      completeBy: tasks[index].completeBy,
      createdAt: tasks[index].createdAt,
      completedAt: moment().format("l"),
    }
    console.log(taskObj)
    firebase.updateCompletedTaskData(uid, taskObj)
    .catch(er => {
      console.log("")
    })
  }

  useEffect(() => {
    firebase.fetchTaskData(uid)
    .onSnapshot(doc => {
      if(doc.data())
        setTasks(doc.data().tasks)
        setLoading(false)
    })
    firebase.fetchCompletedTaskData(uid)
    .onSnapshot(doc => {
      if(doc.data())
        setCompletedTasks(doc.data().tasks)
        setLoading(false)
    })
  }, [uid])

  return (
    <div className="my-tasks">
      {
        loading ? (
          <CircularProgress />
        ) : (
          <>
            <TaskProgress tasks={tasks} completedTasks={completedTasks} />
            <Tasks
              tasks={tasks}
              deleteTask={deleteTask}
              markComplete={markComplete} />
    
            <CompletedTasks 
              completedTasks={completedTasks} />
          </>
        )
      }
    </div>
  )
}

export default MyTasks
