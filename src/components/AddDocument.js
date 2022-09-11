import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const AddDocument = (props) => {
    const [content, setContent] = useState({ question: "", answer: "", img_url: "", link: "", message: "" });
    const [message, setMessage] = useState("");
    const [disabledStatus, setDisabledStatus] = useState({ img_url: false, link: false });
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();
    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'img_url') setDisabledStatus({ link: true })
        if (name === 'link') setDisabledStatus({ img_url: true })
        setContent(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    let uploadDocument = async (event) => {
        setLoading(true);
        const file = event.target.files[0];
        if (event.target.files[0]) {
            let formData = new FormData();
            formData.append('file', file);
            let doc = await UserService.uploadDocument(formData);
            if (doc) {
                setLoading(false);
                setMessage("Successfullly Uploaded.");
                navigate("/home")
            }
            setMessage("Error Uploading document.")
        }
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

                setContent({ ...content, message: _content });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
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
            {content?.message && (
                <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                        {content.message}
                    </div>
                </div>
            )}
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <h3 className="">Add&nbsp;<small className="text-muted">questionnaire</small></h3>
                    </div>
                    <div className="col-sm">
                        <input size="sm" type="file" className="btn btn-outline-dark  me-1 px-8" onChange={uploadDocument} name="file" />
                        <small className="text-sm">Upload .csv file format</small>
                    </div>
                </div>
            </div>
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