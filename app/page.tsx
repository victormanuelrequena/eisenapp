"use client";
import React, { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

interface Task {
  id: number;
  text: string;
  type: string;
}

export default function Home() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  useEffect(() => {
    const taskTypes = ["DO", "SCHEDULE", "DELEGATE", "DELETE"];
    const loadedTasks: Task[] = [];
    taskTypes.forEach((type) => {
      const tasks = localStorage.getItem(`tasks_${type}`);
      if (tasks) {
        loadedTasks.push(
          ...JSON.parse(tasks).map((task: Omit<Task, "type">) => ({
            ...task,
            type,
          }))
        );
      }
    });
    setAllTasks(loadedTasks);
  }, []);

  // Eliminar tarea
  const deleteTask = (id: number, type: string) => {
    const updatedTasks = allTasks.filter((task) => task.id !== id);
    setAllTasks(updatedTasks);

    // Actualizar localStorage para el tipo específico
    const tasksOfType = updatedTasks.filter((task) => task.type === type);
    localStorage.setItem(`tasks_${type}`, JSON.stringify(tasksOfType));
  };

  return (
    <div className="w-full pb-20">
      {/* Task Cards */}
      <div className="flex flex-row gap-10">
        <TaskCard
          title="DO"
          bgColor="bg-[#C6F19F]"
          headerColor="bg-[#32D265]"
        />
        <TaskCard
          title="SCHEDULE"
          bgColor="bg-[#C5E7F9]"
          headerColor="bg-[#2DACFB]"
        />
      </div>
      <div className="flex flex-row gap-10 mt-10">
        <TaskCard
          title="DELEGATE"
          bgColor="bg-[#FEE28D]"
          headerColor="bg-[#FFA222]"
        />
        <TaskCard
          title="DELETE"
          bgColor="bg-[#F8D8D5]"
          headerColor="bg-[#FD8372]"
        />
      </div>

      {/* Tabla de todas las tareas */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
        <Table
          aria-label="Example table with all tasks"
          className="h-auto min-w-full"
        >
          <TableHeader>
            <TableColumn>TASK</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {allTasks.length > 0 ? (
              allTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.text}</TableCell>
                  <TableCell>
                    <Badge
                      color={
                        task.type === "DO"
                          ? "success"
                          : task.type === "SCHEDULE"
                            ? "primary"
                            : task.type === "DELEGATE"
                              ? "warning"
                              : "danger"
                      }
                      variant="flat"
                    >
                      {task.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onPress={() => deleteTask(task.id, task.type)}
                      color="danger"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No tasks available.
                </TableCell>
                <TableCell colSpan={3} className="text-center">
                  No tasks available.
                </TableCell>
                <TableCell colSpan={3} className="text-center">
                  No tasks available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
