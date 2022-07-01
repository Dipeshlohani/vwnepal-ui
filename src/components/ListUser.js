import React, { useState, useMemo, useEffect } from "react";
import { BsPencilSquare, BsXSquare, BsArrowRepeat, BsPlus } from "react-icons/bs";

import Table from "./Table";
import UserService from "../services/user.service";

const ListUser = () => {
    const [content, setContent] = useState([])

    useEffect(() => {
        UserService.getAllUsers().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setContent(_content);
            }
        );
    }, []);

    let handleEdit = () => {

    }

    let handleDelete = () => {

    }
    const columns = useMemo(
        () => [
            {
                Header: "Username",
                columns: [
                    {
                        accessor: "username"
                    },
                ]
            },
            {
                Header: "Email",
                columns: [
                    {
                        accessor: "email"
                    }]
            },
            {
                Header: "Id",
                columns: [
                    {
                        accessor: "_id"
                    }]
            },
        ]
    )

    return (
        <div className="container">
            <header className="jumbotron">
                <div>
                    <Table basic='very' data={content} columns={columns} />
                </div>
            </header >
        </div >
    );
};

export default ListUser;