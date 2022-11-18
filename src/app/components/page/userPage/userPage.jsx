import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";
import Qualities from "../../ui/qualities";
import SelectField from "../../common/form/selectField";
import { useHistory } from "react-router-dom";
import CommentsList from "../../ui/commentsList";

const UserPage = ({ userId }) => {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState();
    const [newComment, setNewComment] = useState({
        userId: ""
    });
    const [permission, setPermission] = useState(true);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        api.users.fetchAll().then((data) => {
            const usersList = data.map((item) => ({
                label: item.name,
                value: item._id
            }));
            setUsers(usersList);
        });
    }, []);

    let commentObject;
    if (users.length !== 0) {
        commentObject = comments.map((item) => {
            const userName = users.find((user) => user.value === item.userId);
            return {
                _id: item._id,
                name: userName.label,
                content: item.content,
                created: item.created_at,
                timePassed: Date.now() - item.created_at,
                dateNow: Date.now()
            };
        });
    }

    useEffect(() => {
        api.users.getById(userId).then((data) => setUser(data));
    }, []);

    const handleClick = () => {
        history.push(history.location.pathname + "/edit");
    };

    const convertToHourMinute = (start, end) => {
        const hours = Math.trunc((end - start) / 1000 / 60 / 60);
        const minutes = Math.round(
            (end - start - hours * 1000 * 60 * 60) / 1000 / 60
        );
        return ` ${hours} часов ${minutes} минут назад`;
    };

    const convertToMonthDay = (start, end) => {
        const months = Math.trunc((end - start) / 1000 / 60 / 60 / 24 / 31);
        const days = Math.round(
            (end - start - months * 1000 * 60 * 60 * 24 * 31) /
                1000 /
                60 /
                60 /
                24
        );
        return ` ${months} месяцев ${days} дней назад`;
    };

    const handleChange = (target) => {
        const commentAuthorId = { userId: target.value };
        setNewComment(Object.assign(newComment, commentAuthorId));
        setPermission((prevState) => (prevState = !prevState));
    };

    const handleCommentContent = ({ target }) => {
        const commentContent = { content: target.value };
        setNewComment(Object.assign(newComment, commentContent));
    };

    const postNewComment = () => {
        const pageId = { pageId: userId };
        setNewComment(Object.assign(newComment, pageId));
        api.comments.add(newComment);
        setRerender(!rerender);
    };

    const handleRemoveComment = (commentId) => {
        api.comments.remove(commentId);
        setRerender(!rerender);
    };

    useEffect(() => {
        api.comments.fetchCommentsForUser(userId).then((data) => {
            data.sort((prev, next) => next.created_at - prev.created_at);
            setComments(data);
        });
    }, [rerender]);

    if (user) {
        return (
            <div className="container">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card mb-3">
                            <div className="card-body">
                                <button
                                    className="
                                    position-absolute
                                    top-0
                                    end-0
                                    btn btn-light btn-sm
                                "
                                    onClick={handleClick}
                                >
                                    <i className="bi bi-gear"></i>
                                </button>
                                <div
                                    className="
                                    d-flex
                                    flex-column
                                    align-items-center
                                    text-center
                                    position-relative
                                "
                                >
                                    <img
                                        src={`https://avatars.dicebear.com/api/avataaars/${(
                                            Math.random() + 1
                                        )
                                            .toString(36)
                                            .substring(7)}.svg`}
                                        className="rounded-circle"
                                        width="150"
                                    />
                                    <div className="mt-3">
                                        <h4>{user.name}</h4>
                                        <p className="text-secondary mb-1">
                                            {user.profession.name}
                                        </p>
                                        <div className="text-muted">
                                            <i
                                                className="
                                                bi bi-caret-down-fill
                                                text-primary
                                            "
                                                role="button"
                                            ></i>
                                            <i
                                                className="
                                                bi bi-caret-up
                                                text-secondary
                                            "
                                                role="button"
                                            ></i>
                                            <span className="ms-2">
                                                {user.rate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-3">
                            <div
                                className="
                                card-body
                                d-flex
                                flex-column
                                justify-content-center
                                text-center
                            "
                            >
                                <h5 className="card-title">
                                    <span>Qualities</span>
                                </h5>
                                <p className="card-text">
                                    <Qualities qualities={user.qualities} />
                                </p>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card mb-3">
                                <div
                                    className="
                                    card-body
                                    d-flex
                                    flex-column
                                    justify-content-center
                                    text-center
                                "
                                >
                                    <h5 className="card-title">
                                        <span>Completed meetings</span>
                                    </h5>

                                    <h1 className="display-1">
                                        {user.completedMeetings}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card mb-2">
                            <div className="card-body">
                                <div>
                                    <h2>New comment</h2>
                                    <div className="mb-4">
                                        <form action="">
                                            <SelectField
                                                defaultOption="Choose..."
                                                options={users}
                                                name="newCommentAuthor"
                                                onChange={handleChange}
                                                value={user.value}
                                            />
                                        </form>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="exampleFormControlTextarea1"
                                            className="form-label"
                                        >
                                            Сообщение
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="exampleFormControlTextarea1"
                                            rows="3"
                                            onChange={handleCommentContent}
                                        ></textarea>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={postNewComment}
                                        disabled={permission}
                                    >
                                        Опубликовать
                                    </button>
                                </div>
                            </div>
                        </div>
                        <CommentsList
                            comments={commentObject}
                            onConvertHM={convertToHourMinute}
                            onConvertMD={convertToMonthDay}
                            onRemoveComment={handleRemoveComment}
                        />
                    </div>
                </div>
            </div>
        );
    } else {
        return <h1>Loading</h1>;
    }
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserPage;
