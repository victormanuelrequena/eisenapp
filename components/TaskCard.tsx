"use client";
import React, { useState, useCallback, useEffect } from "react";
import { PlusCircle, X, Edit2, Check } from "lucide-react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

interface Task {
  id: number;
  text: string;
}

interface TaskCardProps {
  title: string;
  bgColor: string;
  headerColor: string;
}

export default function TaskCard({
  title,
  bgColor,
  headerColor,
}: TaskCardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<number | null>(null);

  // Key for localStorage based on the title
  const storageKey = `tasks_${title}`;

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [storageKey]);

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), text: newTask },
      ]);
      setNewTask("");
    }
  }, [newTask]);

  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const startEditingTask = useCallback((id: number) => {
    setEditingTask(id);
  }, []);

  const finishEditingTask = useCallback((id: number, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
    setEditingTask(null);
  }, []);

  return (
    <div className={`flex flex-col flex-1 ${bgColor} min-h-[360px] rounded-xl`}>
      <div
        className={`${headerColor} h-20 w-full pl-8 flex items-end pb-4 rounded-t-xl`}
      >
        <p className="font-bold text-3xl">{title}</p>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow p-2 rounded-l-md focus:outline-none focus:border-blue-500"
            placeholder="Add a new task..."
          />
          <Button
            onPress={addTask}
            className="bg-blue-500 p-2 hover:bg-blue-600 focus:outline-none"
          >
            <PlusCircle size={24} />
          </Button>
        </div>
        <ul className="space-y-2 overflow-auto max-h-[280px] flex-grow px-6">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center p-2 rounded-md">
              {editingTask === task.id ? (
                <Input
                  type="text"
                  defaultValue={task.text}
                  onBlur={(e) => finishEditingTask(task.id, e.target.value)}
                  className="flex-grow p-1 rounded focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <span className="flex-grow text-black">{task.text}</span>
              )}
              <Button
                onPress={() =>
                  editingTask === task.id
                    ? finishEditingTask(task.id, task.text)
                    : startEditingTask(task.id)
                }
                className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
              >
                {editingTask === task.id ? (
                  <Check size={18} />
                ) : (
                  <Edit2 size={18} />
                )}
              </Button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 ml-2 focus:outline-none"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
