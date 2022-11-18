import React from "react";
import Comment from "./comment";
import PropTypes from "prop-types";

const CommentsList = ({ comments, onConvertHM, onConvertMD, onRemoveComment }) => {
    if (comments) {
        return (
            <div className="card mb-3">
                <div className="card-body">
                    <h2>Comments</h2>
                    <hr />
                    {comments.map((comment) => (
                        <div key={comment._id}>
                            <Comment
                                commentId={comment._id}
                                author={comment.name}
                                content={comment.content}
                                created={comment.created}
                                timePassed={comment.timePassed}
                                dateNow={comment.dateNow}
                                onConvertHM={onConvertHM}
                                onConvertMD={onConvertMD}
                                onRemoveComment={onRemoveComment}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

CommentsList.propTypes = {
    comments: PropTypes.array,
    onConvertHM: PropTypes.func,
    onConvertMD: PropTypes.func,
    onRemoveComment: PropTypes.func
};

export default CommentsList;
