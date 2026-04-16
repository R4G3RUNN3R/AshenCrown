# Nexis Travel, Commerce, and Black Market Roadmap

## Purpose
This roadmap defines the approved direction for travel trade, limited shop stock, illicit goods importation, player resale loops, standard shop limits, black market limits, and the early distinction between Guilds and Consortiums in Nexis.

This document extends the previously approved direction for housing, crafting, infrastructure, city vendors, and transport-linked progression.

---

## Core Direction
Travel in Nexis is not just movement.

Travel should function as:
- regional sourcing
- controlled importation
- limited illicit trade
- player-to-player resale support
- economic route planning
- progression through transport and organizational bonuses later

This is now approved as a core gameplay direction.

---

## Shops Are Useful, But Not Exclusive
Shops should sell useful items that help players, but shops must not be the only source of those items.

### Approved item source rule
Players should also be able to obtain useful items from:
- adventures
- tasks
- quests
- guild adventuring
- consortium caravan jobs
- travel discoveries
- ruins and relic finds later
- other progression loops later

This keeps shops reliable and convenient, while the rest of the world remains rewarding and alive.

---

## Shop Category Structure
Travel destinations and cities should support three distinct shop types.

### Approved shop types
- General Store
- Arms Dealer
- Black Market

### Purpose of each
#### General Store
Provides:
- food
- drink
- common supplies
- low-risk utility items
- regional curios later

#### Arms Dealer
Provides:
- basic weapons
- armor
- combat tools
- repair materials
- combat utility items later

#### Black Market
Provides:
- illicit goods
- contraband
- restricted reagents
- smuggled components
- shady-use consumables

---

## Shop Stock Rule
All shops should generate finite stock.

This is approved as a hard system rule.

### Intended behavior
- stock is limited
- stock replenishes over time
- players can deplete portions of stock
- stock behavior may later vary by item rarity or city type

This should apply to both domestic and foreign shops when relevant.

---

## Standard Shop Purchase Limit
Players must not be able to buy unlimited quantities from normal shops.

### Approved rule
A player may buy a maximum of **100 items per 24 hours** across all standard shops combined.

### Example
A player may buy:
- 20 herbs
- 20 beers
- 20 potions
- 40 stamina draughts

Or:
- 100 beers
- 100 herbs
- any combination totaling 100 items

Once the limit is reached, no more standard shop purchases should be allowed until the window resets.

### Purpose
This prevents:
- shop abuse
- infinite flipping through NPC vendors
- economy distortion through unlimited convenience buying
- over-centralization of progression around shops

---

## Black Market Purchase Limit
Black Market purchases must be much more restricted than standard shopping.

### Approved rule
A player may buy a maximum of **5 black market items per 24 hours**.

This is separate from the standard 100-item shop limit.

### Purpose
Black Market goods are intended to support:
- illicit sourcing
- smuggling-style loops
- limited importation
- profitable player resale

They are not intended to become a second unrestricted vendor channel.

---

## Travel Goods / Illicit Goods Carry Capacity
Illicit goods, also referred to as travel goods, should have a separate import capacity.

### Approved initial rule
A player begins with a **travel-goods carry cap of 5**.

This is the initial amount of travel or illicit goods the player can bring back.

### Approved expansion sources
This carry cap can later be increased by:
- obtaining a mount
- obtaining a vehicle
- Guild passives
- Consortium passives

This must remain separate from normal standard shop purchasing rules.

### Important distinction
- Standard shop cap controls how many items a player can buy per day from normal vendors
- Black market cap controls how many illicit items a player can buy per day
- Travel-goods carry capacity controls how many imported travel goods a player can physically bring back

These are related systems, but they are not the same system.

---

## Travel Import Loop
Travel destinations should contain location-specific goods and limited stock.

This is now approved as a core economy loop.

### Intended loop
- player travels to another city or destination
- player finds destination-specific stock
- player buys useful or illicit goods there
- player returns to Nexis
- player resells those goods, preferably to other players

This makes travel a sourcing and import system rather than a simple movement screen.

---

## Illicit Goods Import Rule
Black Market goods are intended to support limited illicit importation.

### Approved behavior
- player travels to another destination
- player accesses the local Black Market there
- player buys a small amount of illicit stock
- player brings those goods back to Nexis
- player sells them for profit, preferably to other players

### Important resale rule
NPC shops may buy these goods back, but profit should be minimal.

This means:
- player-to-player sales should be the primary profitable route
- NPC resale should function as fallback liquidation only

---

## Player Market Philosophy
Imported goods should generally be more profitable when sold to players than when sold to shops.

### Intended outcome
Players pay for:
- convenience
- avoided travel time
- avoided sourcing effort
- access to location-specific items

This supports a merchant and smuggling economy rather than a pure NPC resale loop.

---

## Guilds vs Consortiums
Guilds and Consortiums must be treated as distinct systems.

This is now approved as a hard structural rule.

### Guilds
Guilds are the Nexis equivalent of Torn factions.

Guilds should support:
- organizational identity
- leader-controlled progression
- a skill tree or upgrade tree
- chosen strategic passives and improvements

### Consortiums
Consortiums are the Nexis equivalent of Torn companies.

Consortiums should support:
- fixed organizational identity by consortium type
- predefined actives and passives
- no freeform leader-selected passive tree
- economic or profession-linked progression by type

### Important distinction
Guilds choose how they specialize through a leader-managed tree.

Consortiums do not choose their passive tree.
Instead, each consortium type comes with its own built-in actives or passives.

This distinction must remain clear in all future implementations.

---

## City Board Rule for Consortiums
Consortiums should be surfaced through the City Board, not treated as a generic guild-style page.

### Approved rule
The City Board must list which consortiums are available so players can:
- see available consortium types
- inspect their passives and actives
- compare their advantages
- decide what they want to create

This makes consortium creation an informed civic and economic choice.

---

## Consortium Type Direction
Because consortiums do not use a skill tree, their identity should come from their fixed type.

### Example future types
- Merchant Consortium
- Caravan Consortium
- Smithing Consortium
- Alchemy Consortium
- Healing Consortium
- Arcane Research Consortium
- Security Consortium
- Exploration Consortium

Each consortium type should later define its own passive and active package.

---

## UI Rules
The player must always be told clearly:
- how much standard shop purchase capacity remains
- how much black market purchase capacity remains
- how much travel-goods carry capacity remains
- that NPC shop resale yields low profit on imported illicit goods
- that player trading is the intended profitable path

### Example displays
- Standard shop purchases remaining today: 37 / 100
- Black market purchases remaining today: 2 / 5
- Travel goods capacity remaining: 1 / 5
- Warning: NPC vendors pay poor rates for illicit imports
- Hint: Imported contraband is usually more profitable when sold to players

This avoids confusion and supports intentional economic planning.

---

## Balance Rules
- Normal shops must not allow infinite buying.
- Black Market buying must be far more restricted than normal shop buying.
- Travel-goods carry capacity must remain separate from shop limits.
- Shops must not be the only source of useful items.
- Travel should support sourcing, importing, and resale.
- Imported illicit goods should be more profitable when sold to players than to shops.
- Guilds and Consortiums must remain separate progression systems.
- Guilds use a skill tree; Consortiums use fixed actives/passives by type.
- Consortium discovery and creation should live on the City Board.

---

## Implementation Roadmap

### Phase 1: Purchase Limit Systems
Define and implement:
- standard shop daily cap (100 items / 24h)
- black market daily cap (5 items / 24h)
- per-player tracking
- reset logic

### Phase 2: Travel-Goods Capacity System
Define and implement:
- base travel-goods carry capacity of 5
- future capacity expansion hooks for mounts, vehicles, Guild passives, and Consortium passives

### Phase 3: Shop Category Expansion
Implement:
- General Store structure
- Arms Dealer structure
- Black Market structure
- city-specific stock pools
- destination-specific useful and illicit goods

### Phase 4: Import and Resale Loop
Implement:
- destination-specific inventories
- return-to-Nexis import flow
- imported item tagging
- minimal NPC resale margins
- stronger player resale support

### Phase 5: City Board Consortium Listing
Implement:
- available consortium list on City Board
- consortium type descriptions
- built-in passive/active previews
- creation decision flow

### Phase 6: Organization Split
Implement:
- Guild progression tree system
- Consortium type system with fixed passives/actives
- clear separation in UI and data model

---

## Hard Rules
- Players may buy at most 100 normal shop items per 24 hours.
- Players may buy at most 5 black market items per 24 hours.
- Players begin with a travel-goods carry cap of 5.
- Travel-goods capacity can later increase through mounts, vehicles, Guild passives, and Consortium passives.
- Black Market goods are intended for limited illicit trade and import loops.
- Shops must not be the only source of useful items.
- Travel should support sourcing, importing, and player resale.
- Player-to-player resale should generally be the intended profit path for imported illicit goods.
- Guilds are the Nexis faction system and use a leader-controlled skill tree.
- Consortiums are the Nexis company system and use fixed actives/passives by type.
- Consortiums must be surfaced on the City Board so players can inspect available types before creating one.

---

## Working Summary
Nexis travel commerce is now approved as a limited-stock, multi-source economy system. Standard shops provide convenience and baseline access, but are restricted by a 100-item daily purchase cap. Black Market buying is restricted to 5 items per day and supports controlled illicit import loops. Travel goods begin with a carry cap of 5 and later expand through transport and organizational progression. Guilds and Consortiums are now formally separated: Guilds function as faction-style organizations with a leader-managed skill tree, while Consortiums function as company-style organizations with fixed actives and passives determined by consortium type and surfaced through the City Board.