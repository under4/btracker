import React from "react";
import "../../css/InReview.css";

import { Link } from "react-router-dom";

import Search from "../../res/svg/search.svg";
import more from "../../res/svg/more.svg";

import Loading from "../Loading";

var apiUrl = process.env.REACT_APP_APIURL;
var appUrl = process.env.REACT_APP_APPURL;
class Team extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentDidMount() {
        console.log("In Review");
        this.fetchInReview();
    }

    fetchInReview() {
        fetch(`${apiUrl}/bug/getInReviewBugs`, {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project: this.props.consoleState.activeProject,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    loading: false,
                    bugs: data.bugs,
                    fBugs: data.bugs,
                });
            });
    }

    goToBug(id) {
        window.location.href = `${appUrl}/console/bug/${id}`;
    }

    closeBug(id, state) {
        fetch(`${apiUrl}/bug/closeBug`, {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bug: id,
                project: state.activeProject,
            }),
        })
            .then((res) => res.text())
            .then((data) => {
                if (data == "success") {
                    document.getElementById("bug" + id).remove();
                    this.fetchInReview();
                }
            });
    }

    reOpenBug(id, state) {
        fetch(`${apiUrl}/bug/reOpenBug`, {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bug: id,
                project: state.activeProject,
            }),
        })
            .then((res) => res.text())
            .then((data) => {
                if (data == "success") {
                    document.getElementById("bug" + id).remove();
                    this.fetchInReview();
                }
            });
    }

    render() {
        if (this.state.loading) {
            return <Loading />;
        }
        return (
            <div id="inReview">
                <div id="bugsUp">
                    <div id="bugsInfo" key={this.state.bugs}>
                        <h4>Bugs To Review: {this.state.bugs.length}</h4>
                    </div>
                    <div id="bugsFilter">
                        <input
                            id="filter"
                            placeholder="Filter labels,ids,etc"
                            onChange={(e) => this.filterBugs(e)}
                        />
                    </div>
                </div>
                <table>
                    <tr>
                        <td id="bId">#</td>
                        <td>Bug</td>
                        <td>Author</td>
                        <td>Submitted By</td>
                        <td>Submit Date</td>
                        <td></td>
                    </tr>
                    {this.state.fBugs.map((bug) => {
                        const closeDate = new Date(
                            bug.closeDate
                        ).toLocaleDateString();
                        //console.log(bug);
                        return (
                            <tr id={`bug${bug._id}`}>
                                <td onClick={() => this.goToBug(bug._id)}>
                                    {bug.bugId}
                                </td>
                                <td onClick={() => this.goToBug(bug._id)}>
                                    {bug.bugTitle}
                                </td>
                                <td onClick={() => this.goToBug(bug._id)}>
                                    {bug.author.authorName}
                                </td>
                                <td onClick={() => this.goToBug(bug._id)}>
                                    {bug.closedBy.name}
                                </td>
                                <td onClick={() => this.goToBug(bug._id)}>
                                    {closeDate}
                                </td>
                                <td className="reviewButtons">
                                    <button
                                        onClick={() =>
                                            this.closeBug(
                                                bug._id,
                                                this.props.consoleState
                                            )
                                        }
                                        className="accept"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            this.reOpenBug(
                                                bug._id,
                                                this.props.consoleState
                                            )
                                        }
                                        className="decline"
                                    >
                                        Decline
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}

export default Team;
