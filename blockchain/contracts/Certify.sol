// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certify {
    // Admin
    address private admin;

    // Structures
    // College Structure
    struct CollegeStruct {
        address collegeAddress;
        string collegeName;
        string collegeDistrict;
        string collegeState;
        uint256 collegePhNo;
        uint256 collegePinCode;
    }

    // Approved College Structure
    struct ApprovedCollegeStruct {
        uint256 collegeId;
        address collegeAddress;
        string collegeName;
        string collegeDistrict;
        string collegeState;
        uint256 collegePhNo;
        uint256 collegePinCode;
    }

    // Verified Certificates
    struct CertificateStruct {
        uint256 certificateId;
        uint256 collegeId;
        string collegeName;
        string studentName;
        string studentPercentage;
        string courseName;
        string issueDate;
    }

    // ID
    uint256 private collegeId = 1;
    uint256 private certificateId = 1;

    // Mappings
    mapping(uint256 => CollegeStruct) private college; // approved colleges
    mapping(uint256 => ApprovedCollegeStruct) private approvedCollegeMap; // approved colleges
    mapping(address => uint256) private collegeIdCollection; // approved colleges ID
    mapping(uint256 => CertificateStruct) private certificateCollections; // All generated certificates
    mapping(uint256 => CertificateStruct[]) private collegeCertificates; // All certificates of a college

    // Arrays
    CollegeStruct[] private requestedColleges; // college requests
    ApprovedCollegeStruct[] private approvedColleges; // Approved colleges

    // Admin Modifier
    modifier onlyAdmin() {
        require(msg.sender == admin, "You are not an Admin");
        _;
    }

    // Events
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

    // create new college request
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

    // Remove college request
    function removeCollegeReq(uint256 index) internal {
        require(index < requestedColleges.length, "Index out of bounds");
        requestedColleges[index] = requestedColleges[
            requestedColleges.length - 1
        ];
        requestedColleges.pop();
    }

    // Create college by admin
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
        approvedColleges.push(
            ApprovedCollegeStruct(
                collegeId,
                _collegeAddress,
                _collegeName,
                _collegeDistrict,
                _collegeState,
                _collegePhNo,
                _collegePinCode
            )
        );
        approvedCollegeMap[collegeId] = ApprovedCollegeStruct(
            collegeId,
            _collegeAddress,
            _collegeName,
            _collegeDistrict,
            _collegeState,
            _collegePhNo,
            _collegePinCode
        );
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
        collegeId += 1;
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

    // Get an approved college
    function getApprovedCollegeById(uint256 _collegeId)
        public
        view
        returns (ApprovedCollegeStruct memory)
    {
        return approvedCollegeMap[_collegeId];
    }

    // Get approved college by address
    function getCollegeIdByAddress(address _collegeAddress)
        public
        view
        returns (uint256)
    {
        require(
            collegeIdCollection[_collegeAddress] != 0,
            "College address not found"
        );
        return collegeIdCollection[_collegeAddress];
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

    // Check if the college is approved by collegeId
    function isApprovedCollege(uint256 _collegeId) private view returns (bool) {
        for (uint256 i = 0; i < approvedColleges.length; i++) {
            if (approvedColleges[i].collegeId == _collegeId) {
                return true; // College is approved
            }
        }
        return false; // College is not approved
    }

    // function to generate a certificate
    function generateCertificate(
        uint256 _collegeId,
        string memory _collegeName,
        string memory _studentName,
        string memory _studentPercentage,
        string memory _courseName,
        string memory _issueDate
    ) public {
        bool flag = isApprovedCollege(_collegeId);
        if (flag == true) {
            certificateCollections[certificateId] = CertificateStruct(
                certificateId,
                _collegeId,
                _collegeName,
                _studentName,
                _studentPercentage,
                _courseName,
                _issueDate
            );

            // Use _collegeId here instead of collegeId
            collegeCertificates[_collegeId].push(
                CertificateStruct(
                    certificateId,
                    _collegeId,
                    _collegeName,
                    _studentName,
                    _studentPercentage,
                    _courseName,
                    _issueDate
                )
            );

            emit certificateGenerated(
                certificateId,
                _collegeId,
                _collegeName,
                _studentName,
                _studentPercentage,
                _courseName,
                _issueDate
            );

            certificateId += 1;
        }
    }

    // Get certificate by ID
    function getCertificateById(uint256 _certificateId)
        public
        view
        returns (CertificateStruct memory)
    {
        return certificateCollections[_certificateId];
    }

    // Get all the certificates of a college
    function getCollegeCertificates(uint256 _collegeId)
        public
        view
        returns (CertificateStruct[] memory)
    {
        bool flag = isApprovedCollege(_collegeId);
        require(flag == true, "College is not approved");
        return collegeCertificates[_collegeId];
    }

    // To check the address is Admin
    function isAdmin() public view returns (bool) {
        if (admin == msg.sender) {
            return true;
        } else {
            return false;
        }
    }
}

// Deployed Contract Address: 0x7B10654a97908d5dD3f97A0f5Af6D07b4fe6dFe5