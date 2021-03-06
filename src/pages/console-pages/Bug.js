import React, { useState, useEffect } from "react";
import "../../css/Bug.css";

import { useParams } from "react-router-dom";
import Loading from "../Loading";

import archiveSvg from "../../res/svg/archive.svg";
import assign from "../../res/svg/assign.svg";
import chevronUp from "../../res/svg/chevron-up.svg";
import bell from "../../res/svg/bell.svg";
import edit from "../../res/svg/edit.svg";
import bellOn from "../../res/svg/notification.svg";
import del from "../../res/svg/delete.svg";
import plus from "../../res/svg/plus.svg";

import Submit from "./SubmitBug";
import AssignBug from "./AssignBug";

var apiUrl = process.env.REACT_APP_APIURL;
var appUrl = process.env.REACT_APP_APPURL;

function editBug() {
    const submitDiv = document.getElementById("submit");
    submitDiv.style.display == "none"
        ? (submitDiv.style.display = "block")
        : (submitDiv.style.display = "none");
}

function assignDiv() {
    const submitDiv = document.getElementById("assign");
    submitDiv.style.display == "none"
        ? (submitDiv.style.display = "block")
        : (submitDiv.style.display = "none");
}

function renderComment(comments, state, data) {
    return comments.map((comment) => {
        return (
            <div className="comment">
                <div className="commentAuthorInfo">
                    <p className="author">{comment.author.authorName}</p>
                    <p className="postDate">
                        {new Date(comment.date).toLocaleDateString()}
                    </p>
                </div>
                <p className="commentText">{comment.commentText}</p>
                <div className="commentOptions">
                    <button
                        onClick={() => {
                            handleReplyDiv(comment._id);
                        }}
                    >
                        Reply
                    </button>
                    <div
                        className="comment reply"
                        id={comment._id}
                        style={{ display: "none" }}
                    >
                        <form
                            className={`replyTextbox`}
                            action={`${apiUrl}/bug/postReply`}
                            method="post"
                        >
                            <textarea
                                name="comment"
                                id={`${comment._id}:tarea`}
                                cols="30"
                                rows="5"
                                placeholder="What do you think?"
                            ></textarea>
                            <input
                                type="hidden"
                                name="commentId"
                                value={comment._id}
                            />
                            <input
                                type={"hidden"}
                                name={"bugId"}
                                value={data._id}
                            />
                            <input
                                type={"hidden"}
                                name={"project"}
                                value={state.activeProject}
                            />
                            <input
                                type={"hidden"}
                                name={"name"}
                                value={state.usrName}
                            />
                            <div className="replyButtons">
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleReplyDiv(comment._id);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit">Reply</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    {comment.comments.length > 0
                        ? renderComment(comment.comments, state, data)
                        : []}
                </div>
            </div>
        );
    });
}

function handleReplyDiv(id) {
    switch (document.getElementById(id).style.display) {
        case "block":
            document.getElementById(id).style.display = "none";
            break;
        case "none":
            document.getElementById(id).style.display = "block";
            break;
    }
    document.getElementById(`${id}:tarea`).value = "";
}

function confirmationBox(action, id, state, user) {
    document.getElementById("confirmationBoxDiv").style.display = "flex";
    switch (action) {
        case "deleteBug":
            document.getElementById("confirmationP").innerText =
                "Are you sure you want to delete this bug?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "markBugComplete":
            document.getElementById("confirmationP").innerText =
                "Are you sure you want to mark this bug complete?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "openBug":
            document.getElementById("confirmationP").innerText =
                "Are you sure you want to reopen this bug?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "markBugOpen":
            document.getElementById("confirmationP").innerText =
                "Are you sure you want to mark this bug open?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "markBugOngoing":
            document.getElementById("confirmationP").innerText =
                "Are you sure you want to mark this bug as ongoing?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "markInReview":
            document.getElementById("confirmationP").innerText =
                "Are you sure you want send this bug to review?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "archive":
            document.getElementById("confirmationP").innerText =
                "Are you sure you to archive this bug?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
        case "unarchive":
            document.getElementById("confirmationP").innerText =
                "Are you sure you to unarchive this bug?";
            document.getElementById("confirmButton").onclick = () => {
                confirmedAction(action, id, state);
            };
            break;
    }
}

function followBug(data, state) {
    fetch(`${apiUrl}/bug/followBug`, {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bugId: `${data._id}`,
            projectId: state.activeProject,
        }),
    }).then((window.location.href = `${appUrl}/console/bug/${data._id}`));
}

function confirmedAction(action, id, state) {
    console.log(id, state.activeProject);
    fetch(`${apiUrl}/bug/${action}`, {
        method: "post",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bugId: `${id}`,
            projectId: state.activeProject,
            state: state,
        }),
    }).then(() => {
        switch (action) {
            case "deleteBug":
                window.location.assign(`${appUrl}/console`);
                break;
            case "markBugComplete":
                window.location.assign(`${appUrl}/console`);
                break;
            case "openBug":
                window.location.assign(`${appUrl}/console/bug/${id}`);
                break;
            default:
                window.location.assign(`${appUrl}/console/bug/${id}`);
                break;
        }
    });
}

const Bug = ({ consoleState, archive }) => {
    const { bId } = useParams();
    const [data, setData] = useState();
    const [preview, setPreview] = useState();
    useEffect(() => {
        fetch(`${apiUrl}/bug/${archive ? `getArchivedBug` : `getBug`}`, {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bugId: `${bId}`,
                projectId: consoleState.activeProject,
            }),
        })
            .then((res) => res.json())
            .then((bugData) => {
                setData(bugData);
            });
    }, []);

    function handleImageChange(e) {
        const submitButton = document.getElementById("imageSubmitButton");
        if (e.target.files.length > 0) {
            submitButton.style.display = "block";
            const pic = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(pic);
        } else {
            submitButton.style.display = "none";
            setPreview();
        }
    }

    async function handleSubmit(e) {
        try {
            await fetch(`${apiUrl}/bug/uploadImage`, {
                method: "POST",
                body: JSON.stringify({
                    data: preview,
                    projectId: consoleState.activeProject,
                    bugId: data._id,
                }),
                headers: { "Content-Type": "application/json" },
            });
        } catch (e) {
            console.error(e);
        }
    }
    if (!data) return <Loading />;
    console.log(data);
    return (
        <div id="bug">
            <div id="submit" style={{ display: "none" }}>
                <Submit consoleState={consoleState} bug={data} />
            </div>

            <div id="bugTexts">
                <div id="bugUpper">
                    <div id="bugInfo">
                        <p>
                            Posted by {data.author.authorName} at{" "}
                            {new Date(data.postDate).toLocaleDateString()}
                        </p>
                        <span>|</span>
                        <span id="due">
                            {data.status == "closed"
                                ? `closed at ${new Date(
                                      data.closeDate
                                  ).toLocaleDateString()}`
                                : `due at ${new Date(
                                      data.due
                                  ).toLocaleDateString()}`}
                        </span>
                    </div>
                    <div id="bugTitleStuff">
                        <div id="bugTitleDiv">
                            <h2 id="bugTitle">{data.bugTitle}</h2>
                            <div className="labels">
                                {
                                    <span className={`label ${data.status}`}>
                                        {data.status}
                                    </span>
                                }
                                {
                                    <span className={`label ${data.priority}`}>
                                        {data.priority}
                                    </span>
                                }
                                {data.labels.map((label) => {
                                    return (
                                        <span
                                            className="label"
                                            style={{
                                                backgroundColor:
                                                    consoleState.team.labels[
                                                        label
                                                    ],
                                            }}
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <div id="bugButtons">
                            <span
                                id="notify"
                                key={data.followedBy}
                                onClick={() => followBug(data, consoleState)}
                            >
                                {data.followedBy &&
                                data.followedBy.includes(consoleState.usrId) ? (
                                    <img src={bellOn} />
                                ) : (
                                    <img src={bell} />
                                )}
                            </span>
                            {data.status != "closed" ? (
                                <div className="bugButtons">
                                    {data.status != "ongoing" ? (
                                        <button
                                            id="ongoing"
                                            onClick={() => {
                                                confirmationBox(
                                                    "markBugOngoing",
                                                    data._id,
                                                    consoleState
                                                );
                                            }}
                                        >
                                            Mark Bug Ongoing
                                        </button>
                                    ) : (
                                        <button
                                            id="open"
                                            onClick={() => {
                                                confirmationBox(
                                                    "markBugOpen",
                                                    data._id,
                                                    consoleState
                                                );
                                            }}
                                        >
                                            Mark Bug Open
                                        </button>
                                    )}
                                    {consoleState.team.users.filter(
                                        (user) => user[0] == consoleState.usrId
                                    )[0][1] == "lead" ? (
                                        <button
                                            id="complete"
                                            onClick={() => {
                                                confirmationBox(
                                                    "markBugComplete",
                                                    data._id,
                                                    consoleState
                                                );
                                            }}
                                        >
                                            Mark Bug as Close
                                        </button>
                                    ) : (
                                        <button
                                            id="inReview"
                                            onClick={() => {
                                                confirmationBox(
                                                    "markInReview",
                                                    data._id,
                                                    consoleState
                                                );
                                            }}
                                        >
                                            Send To Review
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        confirmationBox(
                                            "openBug",
                                            data._id,
                                            consoleState
                                        );
                                    }}
                                >
                                    Open This Bug
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div id="bugDescDiv">
                    <p id="description">{data.description}</p>
                </div>
                <div className="images">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div id="allImagesContainer">
                            <label htmlFor="fileInput" id="addImageLabel">
                                <img src={plus} alt="+" />
                            </label>
                            <div id="imageStuff">
                                <div id="previewImages">
                                    {preview && (
                                        <div className="imgContainer">
                                            <img src={preview} />
                                        </div>
                                    )}
                                </div>
                                <div id="bugImages">
                                    {data.pictures &&
                                        data.pictures.map((picture) => (
                                            <div className="imgContainer">
                                                <img src={picture} />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            name="image"
                            onChange={(event) => handleImageChange(event)}
                        />

                        <input
                            id="imageSubmitButton"
                            type="submit"
                            style={{ display: "none" }}
                            value="Upload Image"
                        />
                    </form>
                </div>
                <div id="assigned">
                    {data.assigned.length > 0 ? (
                        <div id="assignedText">
                            <h4>Assigned To:</h4>
                            <div id="assignedUsers">
                                {data.assigned.map((person) => {
                                    const name = consoleState.team.users.filter(
                                        (usr) => usr[0] == person.user
                                    )[0][2];
                                    return (
                                        <span className="assignedUser">
                                            {name}
                                            <div className="tooltip">
                                                Assigned By:{person.assignedBy}
                                            </div>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div />
                    )}
                    {!archive && (
                        <div id="assignedButtons">
                            <button
                                onClick={() => {
                                    assignDiv();
                                }}
                            >
                                <img src={assign} /> Assign This Bug
                            </button>

                            <button
                                onClick={() => {
                                    confirmationBox(
                                        "deleteBug",
                                        data._id,
                                        consoleState
                                    );
                                }}
                            >
                                <img src={del} />
                                Delete This Bug
                            </button>
                            <button
                                onClick={() => {
                                    editBug();
                                }}
                            >
                                <img src={edit} /> Edit This Bug
                            </button>
                            <div id="assign" style={{ display: "none" }}>
                                <AssignBug
                                    consoleState={consoleState}
                                    bug={data}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {!archive && (
                <form
                    id="addComment"
                    method="post"
                    action={`${apiUrl}/bug/postComment`}
                >
                    <textarea
                        id="commentBox"
                        name="comment"
                        placeholder="Type a comment"
                    />
                    <input type={"hidden"} name={"bugId"} value={data._id} />
                    <input
                        type={"hidden"}
                        name={"project"}
                        value={consoleState.activeProject}
                    />
                    <input
                        type={"hidden"}
                        name={"name"}
                        value={consoleState.usrName}
                    />
                    <button type={"submit"}>Post Comment</button>
                </form>
            )}

            <div id="comments">
                <h3>Comments</h3>
                <div id="commentsDiv">
                    {data.comments.length > 0 ? (
                        renderComment(data.comments, consoleState, data)
                    ) : (
                        <p>No comments yet</p>
                    )}
                </div>
            </div>
            <div id="confirmationBoxDiv" style={{ display: "none" }}>
                <div id="confirmationBox">
                    <div id="confirmationInfo">
                        <p id="confirmationP"></p>
                    </div>
                    <div className="confirmationButtons">
                        <button id="confirmButton">Accept</button>
                        <button
                            type="button"
                            onClick={() => {
                                document.getElementById(
                                    "confirmationBoxDiv"
                                ).style.display = "none";
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bug;
