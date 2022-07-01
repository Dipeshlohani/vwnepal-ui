import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const EditDocument = (props) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    let { id } = useParams();
    let navigate = useNavigate();
    // const validationSchema = Yup.object().shape({
    //     question: Yup.string().required("This field is required!"),
    //     answer: Yup.string().required("This field is required!"),
    // });
    useEffect(() => {
        UserService.getDocument(id).then(
            (response) => {
                console.log(response.data, '=============')
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setContent(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    const handleQuestionChange = (e) => {
        setContent({ ...content, question: e.target.value })
    }
    const handleAnswerChange = (e) => {
        setContent({ ...content, answer: e.target.value })
    }
    const handleEdit = () => {
        console.log("==========")
        UserService.editDocument(id, content).then(
            (response) => {
                console.log(response.data, '=============')
                setContent(response.data);
                navigate("/")
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setContent(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }
    return (
        <div className="container">
            <header className="jumbotron">
                Edit Document
            </header>

            <Formik
                initialValues={content}
                // validationSchema={validationSchema}
                onSubmit={handleEdit}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="question">Question</label>
                        <Field name="question" value={content.question} type="text" className="form-control" onChange={handleQuestionChange} />
                        <ErrorMessage
                            name="question"
                            component="div"
                            className="alert alert-danger"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="answer">Answer</label>
                        <Field name="answer" value={content.answer} type="text" className="form-control" onChange={handleAnswerChange} />
                        <ErrorMessage
                            name="answer"
                            component="div"
                            className="alert alert-danger"
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <button type="submit" className="btn btn-dark btn-block" disabled={loading}>
                            {loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Confirm</span>
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default EditDocument;