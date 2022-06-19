//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Store is ERC20, Ownable {
    uint256 _totalSupply = 1000000000 * 10 ** 18;

    constructor() ERC20 ("STORE", "$STORE") {
        _mint(owner(), _totalSupply);
    }
}