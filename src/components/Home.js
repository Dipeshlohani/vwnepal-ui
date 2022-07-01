import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BsPencilSquare, BsXSquare, BsArrowRepeat, BsPlus } from "react-icons/bs";

import EventBus from "../common/EventBus";


import Table from "./Table";
import UserService from "../services/user.service";

const Home = (props) => {
    const [content, setContent] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("");

    let navigate = useNavigate();

    useEffect(() => {
        UserService.getDocuments().then(
            (response) => {
                console.log(response.data);
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
                columns: [
                    {
                        accessor: "question"
                    },
                ]
            },
            {
                Header: "Answers",
                columns: [
                    {
                        accessor: "answer"
                    }]
            },
            {
                Header: "Actions",
                columns: [
                    {
                        Cell: row => (
                            <div className="btn-group">
                                <button type="button" className="btn " onClick={e => handleEdit(row.row.original)}><BsPencilSquare /></button>
                                <button type="button" className="btn " onClick={e => handleDelete(row.row.original)}><BsXSquare /></button>
                            </div>
                        ),
                        id: "_id"
                    },
                ]
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

    let uploadDocument = async (event) => {
        setLoading(true);
        const file = event.target.files[0];
        if (event.target.files[0]) {
            let formData = new FormData();
            formData.append('file', file);
            let doc = await UserService.uploadDocument(formData);

            // console.log([...content, ...doc?.data?.document], content, '=============doc here -------------------------')
            setLoading(false);
            setMessage("Successfullly Uploaded.");
            window.location.reload();
            setContent([...content, ...doc?.data?.document]);
        }
    }

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

                setContent(_content);
            }
        );
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
                    <button className="btn btn-outline-dark  me-1" onClick={addDocument}>Add Document <BsPlus /></button>
                    <input size="sm" type="file" className="btn btn-outline-dark  me-1" onChange={uploadDocument} name="file" />
                    <button className="btn btn-dark float-end  mr-1" onClick={syncToDialogflow}>Sync <BsArrowRepeat /></button>
                    {/* Upload Document <BsPlus /></input> */}
                    <br />
                    <br />
                    <Table basic='very' data={content} columns={columns} />
                </div>}
            </header>
        </div>
    );
};

export default Home;