import React from "react";
import PropTypes from "prop-types";

const Comment = ({
    commentId,
    author,
    content,
    created,
    timePassed,
    onConvertHM,
    onConvertMD,
    onRemoveComment,
    dateNow
}) => {
    const oneMinute = 60_000;
    const fiveMinutes = 300_000;
    const tenMinutes = 600_000;
    const thirtyMinutes = 1_800_000;
    // const oneHour = 3_600_000;
    const oneDay = 86_400_000;
    // const oneMonth = 2_678_400_000;
    const oneYear = 32_140_800_000;
    const createdDate = new Date(Number(created));
    return (
        <div className="bg-light card-body mb-3">
            <div className="row">
                <div className="col">
                    <div className="d-flex flex-start">
                        <img
                            src={`https://avatars.dicebear.com/api/avataaars/${(
                                Math.random() + 1
                            )
                                .toString(36)
                                .substring(7)}.svg`}
                            className="
                    rounded-circle
                    shadow-1-strong
                    me-3
                "
                            alt="avatar"
                            width="65"
                            height="65"
                        />
                        <div
                            className="
                    flex-grow-1 flex-shrink-1
                "
                        >
                            <div className="mb-4">
                                <div
                                    className="
                            d-flex
                            justify-content-between
                            align-items-center
                        "
                                >
                                    <p className="mb-1">
                                        {author}
                                        <span className="small">
                                            {timePassed <= oneMinute
                                                ? " 1 минуту назад"
                                                : timePassed <= fiveMinutes
                                                ? " 5 минут назад"
                                                : timePassed <= tenMinutes
                                                ? " 10 минут назад"
                                                : timePassed <= thirtyMinutes
                                                ? " 30 минут назад"
                                                : timePassed <= oneDay
                                                ? onConvertHM(created, dateNow)
                                                : timePassed <= oneYear
                                                ? onConvertMD(created, dateNow)
                                                : ` ${createdDate.getFullYear()}.${createdDate.getMonth()}.${createdDate.getDay()}`}
                                        </span>
                                    </p>
                                    <button
                                        className="
                                btn btn-sm
                                text-primary
                                d-flex
                                align-items-center
                            "
                                        onClick={() =>
                                            onRemoveComment(commentId)
                                        }
                                    >
                                        <i
                                            className="
                                    bi bi-x-lg
                                "
                                        ></i>
                                    </button>
                                </div>
                                <p className="small mb-0">{content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Comment.propTypes = {
    commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    author: PropTypes.string,
    content: PropTypes.string,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    timePassed: PropTypes.number,
    onConvertHM: PropTypes.func,
    onConvertMD: PropTypes.func,
    onRemoveComment: PropTypes.func,
    dateNow: PropTypes.number
};

export default Comment;
