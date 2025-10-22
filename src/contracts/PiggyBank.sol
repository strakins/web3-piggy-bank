// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract PiggyBank {
    struct Account {
        uint256 balance;
        uint256 stakedBalance;
        uint256 withdrawalDate;
        uint256 lastDepositDate;
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        uint256 penaltiesPaid;
        bool exists;
    }
    
    struct StakeInfo {
        uint256 amount;
        uint256 withdrawalDate;
        uint256 stakingDate;
        bool isActive;
    }
    
    mapping(address => Account) public accounts;
    mapping(address => StakeInfo[]) public stakes;
    
    uint256 public constant PENALTY_RATE = 5; // 0.05% = 5 basis points out of 10000
    uint256 public constant BASIS_POINTS = 10000;
    
    address public owner;
    uint256 public totalDeposits;
    uint256 public totalWithdrawals;
    uint256 public totalPenalties;
    
    event Deposit(address indexed account, uint256 amount, uint256 timestamp);
    event Stake(address indexed account, uint256 amount, uint256 withdrawalDate, uint256 timestamp);
    event Withdraw(address indexed account, uint256 amount, uint256 penalty, uint256 timestamp);
    event EmergencyWithdraw(address indexed account, uint256 amount, uint256 penalty, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier accountExists() {
        require(accounts[msg.sender].exists, "Account does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        if (!accounts[msg.sender].exists) {
            accounts[msg.sender].exists = true;
        }
        
        Account storage account = accounts[msg.sender];
        account.balance += msg.value;
        account.totalDeposits += msg.value;
        account.lastDepositDate = block.timestamp;
        
        totalDeposits += msg.value;
        
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
    
    function stake(uint256 amount, uint256 withdrawalDate) external accountExists {
        require(amount > 0, "Stake amount must be greater than 0");
        require(withdrawalDate > block.timestamp, "Withdrawal date must be in the future");
        require(accounts[msg.sender].balance >= amount, "Insufficient balance");
        
        Account storage account = accounts[msg.sender];
        account.balance -= amount;
        account.stakedBalance += amount;
        
        stakes[msg.sender].push(StakeInfo({
            amount: amount,
            withdrawalDate: withdrawalDate,
            stakingDate: block.timestamp,
            isActive: true
        }));
        
        emit Stake(msg.sender, amount, withdrawalDate, block.timestamp);
    }
    
    function withdraw(uint256 amount) external accountExists {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(accounts[msg.sender].balance >= amount, "Insufficient balance");
        
        Account storage account = accounts[msg.sender];
        account.balance -= amount;
        account.totalWithdrawals += amount;
        
        totalWithdrawals += amount;
        
        payable(msg.sender).transfer(amount);
        
        emit Withdraw(msg.sender, amount, 0, block.timestamp);
    }
    
    function withdrawStaked(uint256 stakeIndex) external accountExists {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        StakeInfo storage stakeInfo = stakes[msg.sender][stakeIndex];
        require(stakeInfo.isActive, "Stake is not active");
        
        uint256 amount = stakeInfo.amount;
        uint256 penalty = 0;
        
        // Check if withdrawing before the withdrawal date
        if (block.timestamp < stakeInfo.withdrawalDate) {
            penalty = (amount * PENALTY_RATE) / BASIS_POINTS;
            amount -= penalty;
            
            accounts[msg.sender].penaltiesPaid += penalty;
            totalPenalties += penalty;
        }
        
        stakeInfo.isActive = false;
        accounts[msg.sender].stakedBalance -= stakeInfo.amount;
        accounts[msg.sender].totalWithdrawals += amount;
        
        totalWithdrawals += amount;
        
        payable(msg.sender).transfer(amount);
        
        emit Withdraw(msg.sender, amount, penalty, block.timestamp);
    }
    
    function emergencyWithdraw() external accountExists {
        Account storage account = accounts[msg.sender];
        uint256 totalAmount = account.balance + account.stakedBalance;
        require(totalAmount > 0, "No funds to withdraw");
        
        uint256 penalty = (totalAmount * PENALTY_RATE) / BASIS_POINTS;
        uint256 withdrawAmount = totalAmount - penalty;
        
        // Deactivate all stakes
        for (uint i = 0; i < stakes[msg.sender].length; i++) {
            stakes[msg.sender][i].isActive = false;
        }
        
        account.balance = 0;
        account.stakedBalance = 0;
        account.penaltiesPaid += penalty;
        account.totalWithdrawals += withdrawAmount;
        
        totalWithdrawals += withdrawAmount;
        totalPenalties += penalty;
        
        payable(msg.sender).transfer(withdrawAmount);
        
        emit EmergencyWithdraw(msg.sender, withdrawAmount, penalty, block.timestamp);
    }
    
    function getAccount(address accountAddress) external view returns (Account memory) {
        return accounts[accountAddress];
    }
    
    function getStakes(address accountAddress) external view returns (StakeInfo[] memory) {
        return stakes[accountAddress];
    }
    
    function getActiveStakes(address accountAddress) external view returns (StakeInfo[] memory) {
        StakeInfo[] memory allStakes = stakes[accountAddress];
        uint256 activeCount = 0;
        
        // Count active stakes
        for (uint i = 0; i < allStakes.length; i++) {
            if (allStakes[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active stakes
        StakeInfo[] memory activeStakes = new StakeInfo[](activeCount);
        uint256 index = 0;
        
        for (uint i = 0; i < allStakes.length; i++) {
            if (allStakes[i].isActive) {
                activeStakes[index] = allStakes[i];
                index++;
            }
        }
        
        return activeStakes;
    }
    
    function calculatePenalty(uint256 amount) external pure returns (uint256) {
        return (amount * PENALTY_RATE) / BASIS_POINTS;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Owner functions
    function withdrawPenalties() external onlyOwner {
        uint256 penaltyAmount = totalPenalties;
        require(penaltyAmount > 0, "No penalties to withdraw");
        
        totalPenalties = 0;
        payable(owner).transfer(penaltyAmount);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}