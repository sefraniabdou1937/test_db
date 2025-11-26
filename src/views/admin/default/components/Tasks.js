// Chakra imports
import {
  Box,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Checkbox,
  Spinner,
  Input,
  Button,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
// --- Imports ---
import { useAuth } from "contexts/AuthContext";
import { getEndpoint } from "config/api";
import { MdCheckBox, MdDragIndicator, MdDelete } from "react-icons/md";

export default function Tasks({ onTaskChange, ...rest }) {
  const { token } = useAuth(); 

  // --- ÉTATS ---
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [newTaskName, setNewTaskName] = React.useState("");

  // --- CHARGEMENT DES TÂCHES (GET) ---
  const fetchTasks = () => {
    if (!token) return;
    setLoading(true);
    
    // --- URL RELATIVE CORRIGÉE ---
    fetch(getEndpoint("/api/tasks"), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement des tâches:", err);
        setLoading(false);
      });
  };

  // --- AJOUT D'UNE TÂCHE (POST) ---
  const handleAddTask = () => {
    if (newTaskName.trim() === "" || !token) return;
    
    // --- URL RELATIVE CORRIGÉE ---
    fetch(getEndpoint("/api/tasks"), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name: newTaskName }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setNewTaskName("");
        fetchTasks(); 
        if (onTaskChange) onTaskChange();
      })
      .catch((err) => console.error("Erreur d'ajout de tâche:", err));
  };

  // --- MISE À JOUR (PUT) ---
  const handleToggleTask = (taskId) => {
    if (!token) return;
    
    // --- URL RELATIVE CORRIGÉE ---
    fetch(getEndpoint(`/api/tasks/${taskId}`), {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        if (onTaskChange) onTaskChange();
      })
      .catch((err) => console.error("Erreur de mise à jour:", err));
  };

  // --- SUPPRIMER (DELETE) ---
  const handleDeleteTask = (taskId) => {
    if (!token) return;
    
    // --- URL RELATIVE CORRIGÉE ---
    fetch(getEndpoint(`/api/tasks/${taskId}`), {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setTasks(tasks.filter(task => task.id !== taskId));
          if (onTaskChange) onTaskChange();
        }
      })
      .catch((err) => console.error("Erreur de suppression:", err));
  };

  React.useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const brandColor = useColorModeValue("brand.500", "white");

  if (!token) return null; 

  return (
    <Card {...rest} direction='column' w='100%' px='0px' overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Checklist de Voyage
        </Text>
      </Flex>
      <Box px='25px'>
        <Flex mb='20px' gap='10px'>
          <Input
            placeholder='Ex: Préparer le passeport'
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <Button onClick={handleAddTask} colorScheme='brand'>
            Ajouter
          </Button>
        </Flex>

        {loading && (
          <Flex justify='center' align='center' h='100px'>
            <Spinner color={brandColor} />
          </Flex>
        )}
        {!loading && tasks.length === 0 && (
          <Text color={textColorSecondary} textAlign='center' mb='20px'>
            Aucune tâche dans la checklist.
          </Text>
        )}

        {!loading && tasks.map((task) => (
          <Flex key={task.id} mb='20px' align='center'>
            <Checkbox 
              colorScheme='brandScheme' 
              me='16px' 
              isChecked={task.is_done}
              onChange={() => handleToggleTask(task.id)}
            />
            <Text
              fontWeight='bold'
              color={textColor}
              fontSize='md'
              textAlign='start'
              textDecoration={task.is_done ? "line-through" : "none"}
            >
              {task.name}
            </Text>
            
            <Icon
              ms='auto'
              as={MdDelete}
              color='secondaryGray.600'
              w='20px'
              h='20px'
              cursor='pointer'
              onClick={() => handleDeleteTask(task.id)}
            />
          </Flex>
        ))}
      </Box>
    </Card>
  );
}