import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare, BsXSquare, BsArrowRepeat, BsPlusLg } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import EventBus from "../common/EventBus";

import Table from "./Table";
import UserService from "../services/user.service";

const Home = (props) => {
    const [content, setContent] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("");

    const { isLoggedIn } = useSelector((state) => state.auth);

    let navigate = useNavigate();

    useEffect(() => {
        UserService.getDocuments().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setContent(_content);
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "Question",
                accessor: "question"
            },
            {
                Header: "Answers",
                accessor: "answer",
                maxWidth: 250,
                minWidth: 200,
                width: 200,
            },
            {
                Header: "Actions",
                Cell: row => (
                    <div className="btnGroup">
                        <button type="button" className="btn " onClick={e => handleEdit(row.row.original)}><BsPencilSquare /></button>
                        <button type="button" className="btn " onClick={e => handleDelete(row.row.original)}><BsXSquare /></button>
                    </div>
                ),
                maxWidth: 80,
                minWidth: 40,
                width: 40,
                // id: "_id"
            }
        ]
    )

    let handleEdit = (row) => {
        let path = `/document/${row?._id}`;
        navigate(path);
    }

    let handleDelete = async (row) => {
        let doc = await UserService.deleteDocument(row._id);
        let data = await content.filter(function (el) {
            return el._id !== doc.data._id;
        });
        setContent(data)
    }

    let addDocument = () => {
        navigate("/document/new");
    }

    // let uploadDocument = async (event) => {
    //     setLoading(true);
    //     const file = event.target.files[0];
    //     if (event.target.files[0]) {
    //         let formData = new FormData();
    //         formData.append('file', file);
    //         let doc = await UserService.uploadDocument(formData);

    //         // console.log([...content, ...doc?.data?.document], content, '=============doc here -------------------------')
    //         setLoading(false);
    //         setMessage("Successfullly Uploaded.");
    //         window.location.reload();
    //         setContent([...content, ...doc?.data?.document]);
    //     }
    // }

    let syncToDialogflow = () => {
        setLoading(true);
        let data = {
            "knowledgeTypes": [
                "FAQ"
            ],
            "enableAutoReload": true,
            "displayName": "faq_vw",
            "mimeType": "text/csv"
        }
        UserService.syncDocument(data).then(
            (response) => {
                setMessage(`Synced at ${new Date()}`);
                setLoading(false);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                setLoading(false);
                setContent(_content);
                setMessage(_content);
            }
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container">
            {message && (
                <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                        {message}
                    </div>
                </div>
            )}
            <header className="jumbotron">
                {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                ) : <div>
                    <button className="btn btn-outline-dark  me-1" onClick={addDocument} name="Add questionnaire"><BsPlusLg /></button>
                    <button className="btn btn-outline-dark float-end  mr-1" onClick={syncToDialogflow}>Sync <BsArrowRepeat /></button>
                    <br />
                    <br />
                    <Table basic='very' data={content} columns={columns} />
                </div>}
            </header>
        </div>
    );
};

export default Home;