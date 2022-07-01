import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const AddDocument = (props) => {
    const [content, setContent] = useState({ question: "", answer: "", img_url: "", link: "" });
    const [disabledStatus, setDisabledStatus] = useState({ img_url: false, link: false });
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();
    // const validationSchema = Yup.object().shape({
    //     question: Yup.string().required("This field is required!"),
    //     answer: Yup.string().required("This field is required!"),
    // });
    const handleChange = e => {
        const { name, value } = e.target;
        console.log(name, value)
        if (name === 'img_url') setDisabledStatus({ link: true })
        if (name === 'link') setDisabledStatus({ img_url: true })
        setContent(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleAdd = () => {
        UserService.addDocument(content).then(
            (response) => {
                setContent(response.data);
                navigate("/");
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
                <h3>
                    Add&nbsp;
                    <small className="text-muted">Document</small>
                </h3>

            </header>
            <small className="text-muted">Note: Keep question and answers short for better user experience.</small>
            <Formik
                initialValues={content}
                // validationSchema={validationSchema}
                onSubmit={handleAdd}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="question">Enter Question ?</label>
                        <Field name="question" value={content.question} type="text" className="form-control" onChange={handleChange} />
                        <ErrorMessage
                            name="question"
                            component="div"
                            className="alert alert-danger"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="answer">Enter Answer :</label>
                        <Field name="answer" value={content.answer} type="text" className="form-control" onChange={handleChange} />
                        <ErrorMessage
                            name="answer"
                            component="div"
                            className="alert alert-danger"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="img_url">Enter Image URL :</label>
                        <Field name="img_url" value={content.img_url} type="text" className="form-control" onChange={handleChange} disabled={disabledStatus.img_url} />
                        <ErrorMessage
                            name="img_url"
                            component="div"
                            className="alert alert-danger"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="link">Enter Link :</label>
                        <Field name="link" value={content.link} type="text" className="form-control" onChange={handleChange} disabled={disabledStatus.link} />
                        <ErrorMessage
                            name="link"
                            component="div"
                            className="alert alert-danger"
                        />
                    </div>

                    <br />
                    <div className="form-group">
                        <button type="submit" className="btn btn-dark  btn-block w-100" disabled={loading}>
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

export default AddDocument;