const Team = require("../models/team.model");
const TeamMember = require("../models/teamMember.model");

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Team.getCount((err, count) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while getting the number of teams!",
      });
    }

    count++;
    count = count.toString();

    let team = req.body;

    team.team_id = "TE" + count.padStart(6, "0");
    team.status = "active";
    team.createdAt = Date.now();
    team.updatedAt = Date.now();

    Team.create(team, (err, result) => {
      if (err) {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while creating the new team!",
        });
      }

      let teamMember = new TeamMember({});

      teamMember.team_id = result.team_id;
      teamMember.member_id = result.leader_id;
      teamMember.status = "approved";
      teamMember.createdAt = Date.now();
      teamMember.updatedAt = Date.now();

      TeamMember.create(teamMember, (err, result) => {
        if (err) {
          return res.status(500).send({
            message:
              err.message ||
              "Some error occurred while adding new member to the team!",
          });
        }

        return res.status(201).send({
          team_id: result.team_id,
          message: "Team created!",
        });
      });
    });
  });
};

exports.checkDuplicated = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let team = req.body;

  Team.find(team, (err, result) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while checking duplicated team!",
      });
    }

    return res.status(200).send({
      isFound: result.isFound,
    });
  });
};

exports.rename = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let team = req.body;

  Team.update(team, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while updating team name!",
      });
    }

    return res.status(200).send({
      team_id: result.team_id,
      message: "Team renamed!",
    });
  });
};

exports.delete = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let team = req.body;

  team.status = "deleted";

  Team.update(team, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while deleting the team!",
      });
    }

    return res.status(200).send({
      team_id: result.team_id,
      message: "Team deleted!",
    });
  });
};

exports.approve = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let teamMember = req.body;

  teamMember.status = "approved";

  TeamMember.update(teamMember, (err, result) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while approving member to the team!",
      });
    }

    return res.status(201).send({
      team_id: result.team_id,
      member_id: result.member_id,
      message: "Approved to the team!",
    });
  });
};

exports.reject = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let teamMember = req.body;

  teamMember.status = "rejected";

  TeamMember.update(teamMember, (err, result) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while reject the joining request to the team!",
      });
    }

    return res.status(201).send({
      team_id: result.team_id,
      member_id: result.member_id,
      message: "Rejected from the team!",
    });
  });
};

exports.join = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let teamMember = req.body;

  teamMember.status = "pending";
  teamMember.createdAt = Date.now();
  teamMember.updatedAt = Date.now();

  TeamMember.create(teamMember, (err, result) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while adding new member to the team!",
      });
    }

    return res.status(201).send({
      team_id: result.team_id,
      member_id: result.member_id,
      message: "Joining the team!",
    });
  });
};

exports.leave = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let teamMember = req.body;

  teamMember.status = "left";

  TeamMember.update(teamMember, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while leaving the team!",
      });
    }

    return res.status(200).send({
      team_id: result.team_id,
      member_id: result.member_id,
      message: "Left the team!",
    });
  });
};

exports.getAll = (req, res) => {
  Team.getAll((err, result) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while getting all teams!",
      });
    }

    return res.status(200).send(result);
  });
};

exports.getInfo = (req, res) => {
  let team_id = req.query.team_id;

  Team.getInfo(team_id, (err, result) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while getting team information!",
      });
    }

    return res.status(200).send(result);
  });
};