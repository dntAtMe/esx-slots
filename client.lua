-- This resource was made by plesalex100#7387
-- Please respect it, don't repost it without my permission
-- This Resource started from: https://codepen.io/AdrianSandu/pen/MyBQYz
-- ESX Version: saNhje & wUNDER


ESX                             = nil
local PlayerData                = {}
local open 						= false

Citizen.CreateThread(function()
    while ESX == nil do
        Citizen.Wait(10)

        TriggerEvent("esx:getSharedObject", function(xPlayer)
            ESX = xPlayer
        end)
    end

    while not ESX.IsPlayerLoaded() do 
        Citizen.Wait(500)
    end

    if ESX.IsPlayerLoaded() then
        PlayerData = ESX.GetPlayerData()
        CreateBlip()
    end
end)

-------------------------------------------------------------------------------
-- FUNCTIONS
-------------------------------------------------------------------------------
local function drawHint(text)
	SetTextComponentFormat("STRING")
	AddTextComponentString(text)
	DisplayHelpTextFromStringLabel(0, 0, 1, -1)
end

function CreateBlip()
	if Config.blipsEnabled then
		for k,v in ipairs(Config.Slots)do
			local blip = AddBlipForCoord(v.x, v.y, v.z)
			SetBlipSprite(blip, 436)
			SetBlipDisplay(blip, 4)
			SetBlipScale(blip, 1.0)
			SetBlipColour(blip, 49)
			SetBlipAsShortRange(blip, true)
			BeginTextCommandSetBlipName("STRING")
			AddTextComponentString("Pacanele")
			EndTextCommandSetBlipName(blip)
		end
	end
end

function KeyboardInput(textEntry, inputText, maxLength)
    AddTextEntry('FMMC_KEY_TIP1', textEntry)
    DisplayOnscreenKeyboard(1, "FMMC_KEY_TIP1", "", inputText, "", "", "", maxLength)

    while UpdateOnscreenKeyboard() ~= 1 and UpdateOnscreenKeyboard() ~= 2 do
        Citizen.Wait(0)
    end

    if UpdateOnscreenKeyboard() ~= 2 then
        local result = GetOnscreenKeyboardResult()
        Citizen.Wait(500)
        return result
    else
        Citizen.Wait(500)
        return nil
    end
end

-------------------------------------------------------------------------------
-- NET EVENTS
-------------------------------------------------------------------------------
RegisterNetEvent("esx_slots:enterBets")
AddEventHandler("esx_slots:enterBets", function ()
    local bets = KeyboardInput("Enter bet value:", "", Config.MaxBetNumbers)
    if tonumber(bets) ~= nil then
    	TriggerServerEvent('esx_slots:BetsAndMoney', tonumber(bets))
    else
    	TriggerEvent('esx:showNotification', "You need to enter numbers (9999 is max bet).")
    end
end)

RegisterNetEvent("esx_slots:UpdateSlots")
AddEventHandler("esx_slots:UpdateSlots", function(lei)
	SetNuiFocus(true, true)
	open = true
	SendNUIMessage({
		showPacanele = "open",
		coinAmount = tonumber(lei)
	})
end)

-------------------------------------------------------------------------------
-- NUI CALLBACKS
-------------------------------------------------------------------------------
RegisterNUICallback('exitWith', function(data, cb)
	cb('ok')
	SetNuiFocus(false, false)
	open = false
	TriggerServerEvent("esx_slots:PayOutRewards", data.coinAmount)
end)

-------------------------------------------------------------------------------
-- THREADS
-------------------------------------------------------------------------------
Citizen.CreateThread(function ()
	SetNuiFocus(false, false)
	open = false

	local wTime = 500
	local x = 1
	while true do
		Citizen.Wait(wTime)
		langaAparat = false

		for i=1, #Config.Slots, 1 do
			if GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)), Config.Slots[i].x, Config.Slots[i].y, Config.Slots[i].z, true) < 2  then
				x = i
				wTime = 0
				langaAparat = true
				ESX.ShowHelpNotification('Press ~INPUT_PICKUP~ to test your luck at slot machine')
			elseif GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)), Config.Slots[x].x, Config.Slots[x].y, Config.Slots[x].z, true) > 4 then
				wTime = 500
			end
		end
	end
end)

effects = {
"SwitchHUDIn",
"SwitchHUDOut",
"FocusIn",
"FocusOut",
"MinigameEndNeutral",
"MinigameEndTrevor",
"MinigameEndFranklin",
"MinigameEndMichael",
"MinigameTransitionOut",
"MinigameTransitionIn",
"SwitchShortNeutralIn",
"SwitchShortFranklinIn",
"SwitchShortTrevorIn",
"SwitchShortMichaelIn",
"SwitchOpenMichaelIn",
"SwitchOpenFranklinIn",
"SwitchOpenTrevorIn",
"SwitchHUDMichaelOut",
"SwitchHUDFranklinOut",
"SwitchHUDTrevorOut",
"SwitchShortFranklinMid",
"SwitchShortMichaelMid",
"SwitchShortTrevorMid",
"DeathFailOut",
"CamPushInNeutral",
"CamPushInFranklin",
"CamPushInMichael",
"CamPushInTrevor",
"SwitchOpenMichaelIn",
"SwitchSceneFranklin",
"SwitchSceneTrevor",
"SwitchSceneMichael",
"SwitchSceneNeutral",
"MP_Celeb_Win",
"MP_Celeb_Win_Out",
"MP_Celeb_Lose",
"MP_Celeb_Lose_Out",
"DeathFailNeutralIn",
"DeathFailMPDark",
"DeathFailMPIn",
"MP_Celeb_Preload_Fade",
"PeyoteEndOut",
"PeyoteEndIn",
"PeyoteIn",
"PeyoteOut",
"MP_race_crash",
"SuccessFranklin",
"SuccessTrevor",
"SuccessMichael",
"DrugsMichaelAliensFightIn",
"DrugsMichaelAliensFight",
"DrugsMichaelAliensFightOut",
"DrugsTrevorClownsFightIn",
"DrugsTrevorClownsFight",
"DrugsTrevorClownsFightOut",
"HeistCelebPass",
"HeistCelebPassBW",
"HeistCelebEnd",
"HeistCelebToast",
"MenuMGHeistIn",
"MenuMGTournamentIn",
"MenuMGSelectionIn",
"ChopVision",
"DMT_flight_intro",
"DMT_flight",
"DrugsDrivingIn",
"DrugsDrivingOut",
"SwitchOpenNeutralFIB5",
"HeistLocate",
"MP_job_load",
"RaceTurbo",
"MP_intro_logo",
"HeistTripSkipFade",
"MenuMGHeistOut",
"MP_corona_switch",
"MenuMGSelectionTint",
"SuccessNeutral",
"ExplosionJosh3",
"SniperOverlay",
"RampageOut",
"Rampage",
"Dont_tazeme_bro",
"DeathFailOut"
}

Citizen.CreateThread(function () 
	while true do
		if IsScreenblurFadeRunning() then
			print("yes")
		end
		for cnt = 1, #effects do
			isPlayed = AnimpostfxIsRunning(effects[cnt])
			if isPlayed then
				print(effects[cnt], ' ', isPlayed)
				StatSetProfileSettingValue(226, -1)

			end
		end
		Citizen.Wait(0)
	end
end)

RegisterCommand("player", function(source, args)
	GiveWeaponToPed(GetPlayerPed(-1), GetHashKey('weapon_pistol'), 999, false, false)
end)

Citizen.CreateThread(function ()
	while true do
		Citizen.Wait(1)
		if open then
			DisableControlAction(0, 1, true) -- LookLeftRight
			DisableControlAction(0, 2, true) -- LookUpDown
			DisableControlAction(0, 24, true) -- Attack
			DisablePlayerFiring(GetPlayerPed(-1), true) -- Disable weapon firing
			DisableControlAction(0, 142, true) -- MeleeAttackAlternate
			DisableControlAction(0, 106, true) -- VehicleMouseControlOverride
		elseif IsControlJustReleased(0, 38) and langaAparat then
			TriggerEvent('esx_slots:enterBets')
		end
	end
end)
