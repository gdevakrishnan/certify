// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certify {
    address private admin;

    struct CollegeStruct {
        address collegeAddress;
        string collegeName;
        string collegeDistrict;
        string collegeState;
        uint256 collegePhNo;
        uint256 collegePinCode;
    }

    struct ApprovedCollegeStruct {
        uint256 collegeId;
        address collegeAddress;
        string collegeName;
        string collegeDistrict;
        string collegeState;
        uint256 collegePhNo;
        uint256 collegePinCode;
    }

    struct CertificateStruct {
        uint256 certificateId;
        uint256 collegeId;
        string collegeName;
        string studentName;
        string studentPercentage;
        string courseName;
        string issueDate;
    }

    uint256 private collegeId = 1;
    uint256 private certificateId = 1;

    mapping(uint256 => CollegeStruct) private college;
    mapping(uint256 => ApprovedCollegeStruct) private approvedCollegeMap;
    mapping(address => uint256) private collegeIdCollection;
    mapping(uint256 => CertificateStruct) private certificateCollections;
    mapping(uint256 => CertificateStruct[]) private collegeCertificates;

    CollegeStruct[] public requestedColleges;
    ApprovedCollegeStruct[] private approvedColleges;

    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not an Admin");
        _;
    }

    event collegeCreated(
        address _collegeAddress,
        string _collegeName,
        string _collegeDistrict,
        string _collegeState,
        uint256 _collegePhNo,
        uint256 _collegePinCode,
        string message
    );

    event collegeReqCreated(
        address _collegeAddress,
        string _collegeName,
        string _collegeDistrict,
        string _collegeState,
        uint256 _collegePhNo,
        uint256 _collegePinCode,
        string message
    );

    event certificateGenerated(
        uint256 certificateId,
        uint256 collegeId,
        string collegeName,
        string studentName,
        string studentPercentage,
        string courseName,
        string issueDate
    );

    constructor() {
        admin = msg.sender;
    }

    function createCollegeReq(
        string memory _collegeName,
        string memory _collegeDistrict,
        string memory _collegeState,
        uint256 _collegePhNo,
        uint256 _collegePinCode
    ) public {
        requestedColleges.push(
            CollegeStruct(
                msg.sender,
                _collegeName,
                _collegeDistrict,
                _collegeState,
                _collegePhNo,
                _collegePinCode
            )
        );
        emit collegeReqCreated(
            msg.sender,
            _collegeName,
            _collegeDistrict,
            _collegeState,
            _collegePhNo,
            _collegePinCode,
            "College request created"
        );
    }

    function removeCollegeReq(uint256 index) internal {
        uint256 lastIndex = requestedColleges.length - 1;
        if (index < lastIndex) {
            requestedColleges[index] = requestedColleges[lastIndex];
        }
        requestedColleges.pop();
    }

    function createCollege(
        address _collegeAddress,
        string memory _collegeName,
        string memory _collegeDistrict,
        string memory _collegeState,
        uint256 _collegePhNo,
        uint256 _collegePinCode,
        uint256 index
    ) public onlyAdmin {
        college[collegeId] = CollegeStruct(
            _collegeAddress,
            _collegeName,
            _collegeDistrict,
            _collegeState,
            _collegePhNo,
            _collegePinCode
        );
        ApprovedCollegeStruct memory newApprovedCollege = ApprovedCollegeStruct(
            collegeId,
            _collegeAddress,
            _collegeName,
            _collegeDistrict,
            _collegeState,
            _collegePhNo,
            _collegePinCode
        );
        approvedColleges.push(newApprovedCollege);
        approvedCollegeMap[collegeId] = newApprovedCollege;
        removeCollegeReq(index);
        collegeIdCollection[_collegeAddress] = collegeId;

        emit collegeCreated(
            _collegeAddress,
            _collegeName,
            _collegeDistrict,
            _collegeState,
            _collegePhNo,
            _collegePinCode,
            "College created successfully"
        );
        collegeId++;
    }

    function getAllApprovedColleges()
        public
        view
        onlyAdmin
        returns (ApprovedCollegeStruct[] memory)
    {
        return approvedColleges;
    }

    function getApprovedCollegeById(uint256 _collegeId)
        public
        view
        returns (ApprovedCollegeStruct memory)
    {
        return approvedCollegeMap[_collegeId];
    }

    function getCollegeIdByAddress(address _collegeAddress)
        public
        view
        returns (uint256)
    {
        uint256 id = collegeIdCollection[_collegeAddress];
        require(id != 0, "College address not found");
        return id;
    }

    function getAllRequestedColleges()
        public
        view
        onlyAdmin
        returns (CollegeStruct[] memory)
    {
        return requestedColleges;
    }

    function isApprovedCollege(uint256 _collegeId) private view returns (bool) {
        return approvedCollegeMap[_collegeId].collegeId == _collegeId;
    }

    function generateCertificate(
        uint256 _collegeId,
        string memory _collegeName,
        string memory _studentName,
        string memory _studentPercentage,
        string memory _courseName,
        string memory _issueDate
    ) public {
        require(isApprovedCollege(_collegeId), "College is not approved");

        CertificateStruct memory newCertificate = CertificateStruct(
            certificateId,
            _collegeId,
            _collegeName,
            _studentName,
            _studentPercentage,
            _courseName,
            _issueDate
        );
        certificateCollections[certificateId] = newCertificate;
        collegeCertificates[_collegeId].push(newCertificate);

        emit certificateGenerated(
            certificateId,
            _collegeId,
            _collegeName,
            _studentName,
            _studentPercentage,
            _courseName,
            _issueDate
        );

        certificateId++;
    }

    function getCertificateById(uint256 _certificateId)
        public
        view
        returns (CertificateStruct memory)
    {
        return certificateCollections[_certificateId];
    }

    function getCollegeCertificates(uint256 _collegeId)
        public
        view
        returns (CertificateStruct[] memory)
    {
        require(isApprovedCollege(_collegeId), "College is not approved");
        return collegeCertificates[_collegeId];
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    function getRequestedCollegesLength()
        public
        view
        onlyAdmin
        returns (uint256)
    {
        return requestedColleges.length;
    }
}

// Deployed Contract 1. Address: 0x7B10654a97908d5dD3f97A0f5Af6D07b4fe6dFe5
// Deployed Contract 2. Address: 0x5C199117a315333DCBe177AFe1e8dd42737067Ff
// Reference for wagmi:
// https://github.com/gopiinho/web3-frontends/blob/main/src/utils/config.ts
// https://github.com/Vishwa9011/next-wagmi-template
// YT channel for wagmi: Gopinho
