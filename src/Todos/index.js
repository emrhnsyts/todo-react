import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleDateTime from 'react-simple-timestamp-to-date';

function Todos() {
    const [todoList, setTodoList] = useState([])
    const [loading, setLoading] = useState(true)
    const [todoText, setTodoText] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [todoDoBeUpdated, setTodoToBeUpdated] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const onTodoTextChange = (e) => {
        setTodoText(e.target.value)
    }

    const fetchData = () => {
        axios("todos").then((res) => setTodoList(res.data));
        if (loading) {
            setLoading(false)
        }
    }

    const onDelete = (todoId) => {
        axios.delete(`todos/${todoId}`).then((res) => fetchData()).then(() => {
            toast.error("To-do deleted", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        })
    }


    const onSubmit = (e) => {
        e.preventDefault();

        if (!isEdit) {
            axios.post("todos", {
                text: todoText
            }).then((res) => {
                setTodoText("");
            }).then(() => fetchData())
                .catch((err) => toast.warn(err.response.data.details[0], {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })).then(() => {
                    toast.success("To-do added", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                });
        }
        else {
            axios.put(`todos/${todoDoBeUpdated.id}`, {
                text: todoText
            }).then((res) => {
                setTodoText("");
                setTodoToBeUpdated({});
                setIsEdit(false);
            }).then(() => fetchData())
                .catch((err) => toast.warn(err.response.data.details[0], {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })).then(() => {
                    toast.warn("To-do info", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                });
        }
    }

    const onChecked = (todo) => {
        axios.put(`todos/${todo.id}`, {
            text: todo.text,
            isCrossed: !todo.isCrossed
        }).then(() => {
            fetchData();
        })
    }

    const onTodoUpdate = (todo) => {
        setIsEdit(true);
        setTodoToBeUpdated(todo);
        setTodoText(todo.text)
    }

    return (
        <div className="container mt-5">
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="To-do" aria-label="To-do" value={todoText}
                    onChange={onTodoTextChange} aria-describedby="button-addon2" />
                <button className="btn btn-success" type="button" onClick={onSubmit} id="button-addon2">
                    {isEdit ? "Güncelle" : "Ekle"}
                </button>
            </div>
            {loading ? <h1>'loading'</h1> : <div className='row'>
                {todoList.map((todo) => {
                    return <React.Fragment key={todo.id}>
                        <div className="col-md-6 mb-2">
                            <div className="card">
                                <div className='card-body'>
                                    <h5 className='card-title'>{todo.isCrossed ? <strike>{todo.text}</strike> : todo.text}</h5>
                                    <p className='card-text'>
                                        Created at: <SimpleDateTime
                                            dateSeparator="-"
                                            timeSeparator="."
                                        >
                                            {todo.createdAt}
                                        </SimpleDateTime>
                                    </p>
                                    <div className='align-items-center d-flex justify-content-center'>
                                        <button onClick={() => onDelete(todo.id)} className="btn btn-danger me-2"
                                            type="button" id="button-addon3">Sil</button>
                                        <button className="btn btn-primary"
                                            onClick={() => onTodoUpdate(todo)} type="button">Güncelle</button>


                                        <div className="form-check ms-2">
                                            <input className="form-check-input" type="checkbox" id={todo.id}
                                                onChange={() => { onChecked(todo) }} />
                                            <label className="form-check-label" for={todo.id}>
                                                Done
                                            </label>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </React.Fragment>
                })}
            </div>
            }
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

        </div >
    )
}

export default Todos;