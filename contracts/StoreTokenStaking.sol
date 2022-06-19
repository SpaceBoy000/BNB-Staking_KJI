//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '@openzeppelin/contracts/utils/math/Math.sol';

// MasterChef is the master of Peace. He can make Peace and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once PEACE is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract StoreStaking is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardLockedUp;
        uint256 lastDepositTime;
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 apr;       // How many allocation points assigned to this pool. PEACEs to distribute per block.
        uint256 withdrawLockPeriod; // lock period for this pool
        uint256 balance;            // pool token balance, allow multiple pools with same token
    }

    IERC20 public RewardToken;
    address public devaddr;
    uint256 public limitAmount = 100 * 10 ** 18;
    uint256 public rewardRate = 1;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        address _rewardToken,
        address stakingToken
    ) public {
        RewardToken = IERC20(_rewardToken);
        add(IERC20(stakingToken), 200, 180 days);
        add(IERC20(stakingToken), 300, 360 days);
    }

    function set(uint256 _pid, uint256 _apr, uint256 _withdrawLockPeriod) public onlyOwner {
        PoolInfo storage pool = poolInfo[_pid];
        pool.apr = _apr;
        pool.withdrawLockPeriod = _withdrawLockPeriod;
    }

    function setRewardRate (uint256 _rewardRate) public onlyOwner {
        rewardRate = _rewardRate;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(IERC20 _lpToken, uint256 _apr, uint256 _withdrawLockPeriod) internal {
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            apr: _apr,
            withdrawLockPeriod: _withdrawLockPeriod,
            balance: 0
        }));
    }

    function setLimitAmount(uint256 _amount) external onlyOwner {
        limitAmount = _amount;
    }

    // View function to see pending PEACEs on frontend.
    function pendingToken(uint256 _pid, address _user) public view returns (uint256 reward) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        reward = user.amount.mul(rewardRate).mul(block.timestamp - user.lastDepositTime).div(1 days).mul(pool.apr).div(100);
        reward = reward + user.rewardLockedUp;
    }


    // Deposit LP tokens to MasterChef for PEACE allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        require (_amount > 0, "Zero Deposit");
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        user.rewardLockedUp = pendingToken(_pid, msg.sender);
        user.amount = user.amount.add(_amount);
        user.lastDepositTime = block.timestamp;
        pool.balance = pool.balance.add(_amount);

        emit Deposit(msg.sender, _pid, _amount);
    }

    // View function to see if user can harvest reward token.
    function canHarvest(uint256 _pid, address _user) public view returns (bool) {
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo memory user = userInfo[_pid][_user];
        
        return block.timestamp >= (pool.withdrawLockPeriod + user.lastDepositTime);
    }


    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, bool _unstake) public {
        require(RewardToken.balanceOf(msg.sender) >= limitAmount, "You should own at least limit amount of reward token");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        // require( canHarvest(_pid, msg.sender), "Not Staked or Lock Period");
        require( user.amount > 0, "you didn't deposit any money");

        uint256 penaltyFee = 10000 - Math.min(10000 * (block.timestamp - user.lastDepositTime).div(pool.withdrawLockPeriod), 10000);

        uint256 reward = pendingToken(_pid, msg.sender) + user.rewardLockedUp;
        uint256 penaltyAmount = reward.mul(penaltyFee).div(10000);
        RewardToken.safeTransfer(msg.sender, reward - penaltyAmount);
        user.rewardLockedUp = 0;
        user.lastDepositTime = block.timestamp;

        if (_unstake) {
            pool.lpToken.safeTransfer(address(msg.sender), user.amount);
            pool.balance = pool.balance.sub(user.amount);
            emit Withdraw(msg.sender, _pid, user.amount);
            user.amount = 0;
        }
        
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 feeAmount = user.amount.div(100);
        pool.lpToken.safeTransfer(address(msg.sender), user.amount.sub(feeAmount));
        pool.lpToken.safeTransfer(devaddr, feeAmount);

        pool.balance = pool.balance.sub(user.amount);

        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "devaddr: wut?");
        require(msg.sender != address(this), "devaddr: wut?");
        require(msg.sender != address(0), "devaddr: wut?");
        devaddr = _devaddr;
    }
}