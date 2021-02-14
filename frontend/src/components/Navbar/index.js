import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Navbar = (props) => {
    return (
        <NavbarWrapper>
            Tesla Swap
        </NavbarWrapper>
    )
}

Navbar.propTypes = {

}

const NavbarWrapper = styled.div`
    position: sticky;
	top: 0;
	z-index: 1;
`;

export default Navbar;
