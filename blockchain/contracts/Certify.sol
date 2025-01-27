// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certify {
    // Admin
    address private admin;

    struct CollegeStruct {
        address collegeAddress;
        string collegeName;
        string collegeDistrict;
        string collegeState;
        uint256 collegePhNo;
        uint256 collegePinCode;
    }

    // College and certificate structs
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

    // College and certificate IDs
    uint256 private collegeId = 1;
    uint256 private certificateId = 1;

    // College and certificate mappings
    mapping(uint256 => CollegeStruct) private college;
    mapping(uint256 => ApprovedCollegeStruct) private approvedCollegeMap;
    mapping(address => uint256) private collegeIdCollection;
    mapping(uint256 => CertificateStruct) private certificateCollections;
    mapping(uint256 => CertificateStruct[]) private collegeCertificates;

    // College and certificate arrays
    CollegeStruct[] public requestedColleges;
    ApprovedCollegeStruct[] private approvedColleges;

    // Admin modifier
    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not an Admin");
        _;
    }

    // College and certificate events
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

    // Admin constructor
    constructor() {
        admin = msg.sender;
    }

    // Create new college request
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

    // Get length of request array
    function getRequestedCollegesLength()
        public
        view
        onlyAdmin
        returns (uint256)
    {
        return requestedColleges.length;
    }

    // Remove college request
    function removeCollegeReq(uint256 index) public {
        uint256 lastIndex = requestedColleges.length - 1;
        if (index < lastIndex) {
            requestedColleges[index] = requestedColleges[lastIndex];
        }
        requestedColleges.pop();
    }

    // Approve college request
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

    // Get all approved colleges
    function getAllApprovedColleges()
        public
        view
        onlyAdmin
        returns (ApprovedCollegeStruct[] memory)
    {
        return approvedColleges;
    }

    // Get approved college by ID
    function getApprovedCollegeById(
        uint256 _collegeId
    ) public view returns (ApprovedCollegeStruct memory) {
        return approvedCollegeMap[_collegeId];
    }

    // Get college by address
    function getCollegeIdByAddress(
        address _collegeAddress
    ) public view returns (uint256) {
        uint256 id = collegeIdCollection[_collegeAddress];
        require(id != 0, "College address not found");
        return id;
    }

    // Get all requested colleges
    function getAllRequestedColleges()
        public
        view
        onlyAdmin
        returns (CollegeStruct[] memory)
    {
        return requestedColleges;
    }

    // To check the college is approved or not
    function isApprovedCollege(uint256 _collegeId) private view returns (bool) {
        return approvedCollegeMap[_collegeId].collegeId == _collegeId;
    }

    // Generate new certificate by approved college
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

    // Get certificate by ID
    function getCertificateById(
        uint256 _certificateId
    ) public view returns (CertificateStruct memory) {
        return certificateCollections[_certificateId];
    }

    // Get all college certificates
    function getCollegeCertificates(
        uint256 _collegeId
    ) public view returns (CertificateStruct[] memory) {
        require(isApprovedCollege(_collegeId), "College is not approved");
        return collegeCertificates[_collegeId];
    }

    // To check the user is admin or not
    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }
}

// Deployed Contract Address: 0xf2609f6017816cF3BD2D1246E7936Dd920D537F0

// Reference for wagmi:
// https://github.com/gopiinho/web3-frontends/blob/main/src/utils/config.ts
// https://github.com/Vishwa9011/next-wagmi-template
// YT channel for wagmi: Gopinho