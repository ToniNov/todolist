import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import {Button, IconButton, Paper, PropTypes} from '@material-ui/core'
import {Delete} from '@material-ui/icons'
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from '../../../api/todolists-api'
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer'
import {useActions} from "../../../app/store";
import {tasksActions, todolistsActions} from "../index";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {
    console.log('Todolist called')

    const {changeTodolistFilter, removeTodolist, changeTodolistTitle} = useActions(todolistsActions)
    const {addTask, fetchTasks, updateTask, removeTask} = useActions(tasksActions)

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(props.todolist.id)
    }, [])

    const addTaskCallback = useCallback((title: string) => {
        addTask({title: title, todolistId: props.todolist.id})
    }, [props.todolist.id])

    const removeTodolistCallback = () => {
        removeTodolist(props.todolist.id)
    }
    const changeTodolistTitleCallback = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title: title})
    }, [props.todolist.id])

    const onFilterButtonClickHandler = useCallback((buttonFilter: FilterValuesType) =>
        changeTodolistFilter({filter: buttonFilter, id: props.todolist.id}), [props.todolist.id])



    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const renderFilterButton = (buttonFilter: FilterValuesType,
                                color: PropTypes.Color,
                                textButton: string) => {
        return (
            <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                    onClick={()=> onFilterButtonClickHandler(buttonFilter)}
                    color={color}>{textButton}
            </Button>
        )
    }

    return <Paper style={{padding: "10px", position: "relative"}}>
        <IconButton onClick={removeTodolistCallback}
                    disabled={props.todolist.entityStatus === 'loading'}
                    style={{position: "absolute", right: "5px",top: "5"}}
        >
            <Delete/>
        </IconButton>
        <h3>
            <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback}/>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            {renderFilterButton( 'all','default',"All")}
            {renderFilterButton( 'active','primary',"Active")}
            {renderFilterButton( 'completed','secondary',"Completed")}
        </div>
    </Paper>
})




