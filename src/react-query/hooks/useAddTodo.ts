import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../constants";
import APIClient from "../servics/apiClient";
import todoService,{ Todo } from "../servics/todoService";

interface AddTodoContext{
    previousTodos:Todo[]
  }
  
const useAddTodo = (onAdd:()=>void) => {
    const queryClient = useQueryClient();
    return useMutation<Todo,Error,Todo,AddTodoContext>({
        mutationFn:todoService.post,
       onMutate:(newTodo:Todo)=>{
          const previousTodos = queryClient.getQueriesData<Todo[]>(CACHE_KEY_TODOS) || [];
          queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS,(todos = []) => [
            newTodo,
            ...todos,
        ]);
  
       onAdd();
   
       return {previousTodos}
       },
  
       onSuccess:(savedTodo,newTodo)=>{
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS,todos=> 
          todos?.map(todo=>
            todo === newTodo? savedTodo:todo
          )
        );
       },
  
       onError:(error,newTodo,context)=>{
         if(!context) return;
  
         queryClient.setQueryData<Todo[]>(['dodos'],context.previousTodos)
       }
  
      });
  
}
export default useAddTodo;