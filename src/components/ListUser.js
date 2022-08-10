import React, { useState, useMemo, useEffect } from "react";

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

    const columns = useMemo(
        () => [
            {
                Header: "Username",
                accessor: "username"
            },
            {
                Header: "Email",
                accessor: "email"
            },
            {
                Header: "Id",
                accessor: "_id"
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