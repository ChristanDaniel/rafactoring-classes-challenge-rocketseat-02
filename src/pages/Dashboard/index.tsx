import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import Food from '../../components/Food';

//aqui é aonde junta tudo?

interface IFood {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface editingFood {
  food: IFood;
  editModalOpen: boolean;
}
//pq nessa função o parentes ficou vazio?
function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);//o que esta acontecendo aqui?
  const [editingFood, setEditingFood] = useState({} as editingFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect (() => {
    async function loadFoods() {
      const response = await api.get<IFood[]>("/foods");
      setFoods(response.data);
    }
    loadFoods();
  }, []);

  async function handleAddFood(food: IFood) {
    console.log('food', food)
    try {  //o que é Try?
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {    //o que isso faz e o que é isso?
      console.log(err);
    }
  }

  const toggleModal = () => {
    setModalOpen (!modalOpen); //o que esse !modalOpen faz?
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFood) => {
    setEditingFood({ food, editModalOpen: true });
    setEditModalOpen(true);
  };

  const handleUpdateFood = async (food: IFood) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.food.id}`,{ //o que essa api faz? é assim que se chama?
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) => 
      f.id !== foodUpdated.data.id ? f : foodUpdated.data //o que isso faz?
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id:number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
